import type { IAuth, IDBInvite, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { invite: _id } = await readBody(event)

    const invite = await DB.Invite
    .findOne({ _id: _id, from: auth._id })
    .populate({ path: 'from', select: 'username level' })
    .populate({  path: 'user', select: 'username' }) as IDBInvite

    if(!invite) throw 'Thông tin lời mời không tồn tại'
    if(!!invite.receive.invitation) throw 'Bạn đã nhận thưởng này rồi'
    if(invite.payment < 20000) throw 'Bạn bè phải nạp tối thiểu 20.000 VNĐ thì bạn mới được nhận'

    // Get Level From
    const level = await DB.UserLevel.findOne({ _id: (invite.from as IDBUser).level }).select('gift') as IDBUserLevel
    const reward = level.gift.invite
    
    const notifyToFrom = `
      Nhận <b>${reward.toLocaleString('vi-VN')} Ecoin</b> từ bạn bè
      <b>${(invite.user as IDBUser).username}</b> đạt đủ điều kiện
    `

    //  Cập nhật số bạn bè thực
    await DB.User.updateOne({ _id: invite.from._id }, { $inc: { 'invite.friend': 1 }})
    // Cập nhật thông tin lời mời
    await DB.Invite.updateOne({ _id: invite._id }, { 
      $inc: { 'reward': reward },
      $set: { 'receive.invitation': true }
    })

    // Tạo lịch sử nhận thưởng
    await DB.InviteReward.create({
      invite: invite._id,
      from: invite.from._id,
      user: invite.user._id,
      number: reward,
      reason: notifyToFrom
    })

    // Log
    logUser({
      user: invite.from._id,
      action: notifyToFrom,
      type: 'invite.verify',
      target: invite._id.toString()
    })

    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})