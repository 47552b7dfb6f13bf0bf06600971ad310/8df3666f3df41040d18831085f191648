import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBCollab, IDBConfig, IDBGate, IDBInvite, IDBUser, IDBUserLevel } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, money, reason } : IBodyData, 
  verifier? : Types.ObjectId
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 3
  ) throw 'Mã trạng thái không hợp lệ'
  if(
    !!isNaN(parseInt(String(money))) 
    || parseInt(String(money)) < 0 
  ) throw 'Số tiền không hợp lệ'
  if(status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Get Config
  const config = await DB.Config.findOne({}).select('telebot security promo') as IDBConfig
  if(!config) throw 'Không tìm thấy cấu hình hệ thống'

  // Set Real Value
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'
  
  // Get Payment
  const payment = await DB.Payment
  .findOne({ _id: _id })
  .select('code gate user status')
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Bot
  const bot = await DB.User.findOne({'username': 'bot'}).select('username') as IDBUser
  if(!bot) throw 'Không tìm thấy thông tin Bot'

  // Get User
  const user = await DB.User.findOne({ _id: payment.user })
  .select(profileSelect(['reg']).user)
  .populate(profileSelect().level)
  .populate(profileSelect().guild) as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'

  // Get Gate
  const gate = await DB.Gate.findOne({ _id: payment.gate }).select('collab name person number type') as IDBGate
  if(!gate) throw 'Không tìm thấy thông tin kênh nạp'

  // Check Collab Gate Pay
  let isMinusCollab = false
  if(!!gate.collab && realStatus == 1){
    const collab = await DB.Collab.findOne({ _id: gate.collab }).select('gatepay') as IDBCollab
    if(!collab) throw 'Không tìm thấy thông tin cộng tác viên'
    if(realMoney > collab.gatepay) throw 'Số tiền nạp vượt quá giới hạn của kênh nạp này'
    isMinusCollab = true
  }
  
  // Update Payment
  const time = new Date()
  const verify_person = realStatus == 3 ? user._id : (!!verifier ? verifier : bot._id)
  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })
  if(!!isMinusCollab){
    await DB.Collab.updateOne({ _id: gate.collab }, { $inc: { 'gatepay': realMoney * -1 } })
    await DB.CollabNotify.create({
      collab: gate.collab,
      title: 'Cập nhật số dư thanh toán',
      content: `Đã trừ <b>${realMoney.toLocaleString('vi-VN')}</b> VNĐ từ giao dịch nạp tiền thành công <b>${payment.code}</b>`,
      type: 'gatepay.minus'
    })
  }
  
  // Check Status
  if(realStatus == 1){
    // Set Coin
    let realCoin = realMoney
    let firstCoin = 0
    let secondCoin = 0
    
    // Thẻ cào chiết khấu 20%
    if(gate.type == 1) realCoin = Math.floor((realCoin * 80) / 100) 

    // Check First Pay
    const countFirstPay = await DB.LogUser.count({ user: user._id, type: 'pay.first' })
    if(countFirstPay == 0) firstCoin = Math.floor((realCoin * config.promo.payment.first) / 100) // Tặng thêm Xu cho nạp lần đầu

    // Check Second Pay
    const countSecondPay = await DB.LogUser.count({ user: user._id, type: 'pay.second' })
    if(countFirstPay == 1 && countSecondPay == 0) secondCoin = Math.floor((realCoin * config.promo.payment.second) / 100) // Tặng thêm Xu cho nạp lần 2

    // Sum Coin To Receive
    const coinReceived = realCoin
    const lockCoinReceived = firstCoin + secondCoin
    const expReceived = realMoney

    // Check Invite
    const invite = await DB.Invite
    .findOne({ user: user._id })
    .populate({ 
      path: 'from', select: 'level', 
      populate: { path: 'level', select: 'bonus.invite.payment' }
    }) as IDBInvite
    if(!!invite){
      const inviteFrom = invite.from as IDBUser
      const inviteFromLevel = inviteFrom ? inviteFrom.level as IDBUserLevel : null
      const bonusEcoinToFrom = inviteFromLevel ? inviteFromLevel.bonus.invite.payment : 0
      const reward = Math.floor((realMoney * bonusEcoinToFrom) / 100) 
      if(reward > 0){
        // Cập nhật số Ecoin cho người mời
        await DB.User.updateOne({ _id: inviteFrom._id }, { $inc: { 'currency.ecoin': reward }})
        // Cập nhật thông tin lời mời
        await DB.Invite.updateOne({ _id: invite._id }, { $inc: { 'payment': realMoney, 'reward': reward }})

        const notifyToFrom = `
          Nhận <b>${reward.toLocaleString('vi-VN')} Ecoin</b> từ bạn bè
          <b>${user.username}</b> nạp <b>${realMoney.toLocaleString('vi-VN')} VNĐ</b> 
        `

        // Tạo lịch sử nhận thưởng
        await DB.InviteReward.create({
          invite: invite._id,
          from: inviteFrom._id,
          user: invite.user,
          number: reward,
          reason: notifyToFrom
        })

        // log
        logUser({
          user: inviteFrom._id,
          action: notifyToFrom,
          type: 'invite.payment',
          target: realMoney.toString()
        })
      }
    }

    // Update User
    await DB.User.updateOne({ _id: payment.user },{ $inc: { 
      'currency.coin': coinReceived, 
      'currency.lcoin': lockCoinReceived, 
      'currency.exp': expReceived,
      'statistic.pay': realMoney,
    }})

    // Update Collab Statistic Payment
    if(user.reg.collab){
      const collabOfUser = await DB.Collab.findOne({ _id: user.reg.collab }).select('_id') as IDBCollab
      collabOfUser && await DB.Collab.updateOne({ _id: collabOfUser._id }, { $inc: { 'statistic.payment': realMoney }})
    }

    // Log User
    logAdmin(event, `Chấp nhận giao dịch nạp tiền <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verify_person)
    logUser({
      user: user._id, 
      action: `Nhận <b>${coinReceived.toLocaleString('vi-VN')} Xu</b> từ giao dịch nạp tiền thành công <b>${payment.code}</b>`,
      type: 'pay.success',
      target: realMoney.toString()
    })
    if(firstCoin > 0) logUser({
      user: user._id, 
      action: `Tặng thêm <b>${firstCoin.toLocaleString('vi-VN')} Xu Khóa</b> vì nạp lần đầu`,
      type: 'pay.first',
      target: realMoney.toString()
    })
    if(secondCoin > 0) logUser({
      user: user._id, 
      action: `Tặng thêm <b>${secondCoin.toLocaleString('vi-VN')} Xu Khóa</b> vì nạp lần 2`,
      type: 'pay.second',
      target: realMoney.toString()
    })

    // Notify Global
    IO.emit('notify-global-push', {
      user: user,
      content: `vừa tăng thêm <b>${expReceived.toLocaleString('vi-VN')}</b> Tu Vi`
    })

    // Telebot Send Message
    // if(!!config.telebot.payment.receive){
    //   const timeFormat = formatDate(event, time)
    //   const gateReceive : string = gate.type == 1 ? 'Thẻ Cào' : `${gate.name} - ${gate.person} - ${gate.number}`

    //   await botTeleSendMessage(event, {
    //     url: config.telebot.payment.receive,
    //     secret: config.security.manage.password,
    //     message: `
    //       Chú ý nhận tiền
    //       » Mã giao dịch: ${payment.code}
    //       » Số tiền: ${realMoney.toLocaleString('vi-VN')}
    //       » Thời gian: ${timeFormat.day}/${timeFormat.month}/${timeFormat.year} - ${timeFormat.hour}:${timeFormat.minute}
    //       » Tài khoản nhận: ${gateReceive}
    //     `
    //   })
    // }

    // Socket Update Auth
    IO.to(user._id.toString()).emit('auth-update')
  }
  else if(realStatus == 2){
    logUser({
      user: user._id, 
      action: `Bạn bị từ chối giao dịch <b>${payment.code}</b>`,
      type: 'pay.refuse'
    })
    logAdmin(event, `Từ chối giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verify_person)
  }
  else {
    logUser({
      user: user._id, 
      action: `Hoàn tác giao dịch nạp tiền <b>${payment.code}</b>`,
      type: 'pay.undo'
    })
  }
}