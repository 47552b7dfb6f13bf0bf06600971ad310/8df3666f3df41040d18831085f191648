import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBConfig, IDBGameChina, IDBGameChinaPayment, IDBGameChinaUser, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  reason?: string
}

export default async (
  event: H3Event, 
  { _id, status, reason } : IBodyData, 
  game: IDBGameChina,
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 3
  ) throw 'Mã trạng thái không hợp lệ'
  if((status == 2 || status == 3) && !reason) throw 'Không tìm thấy lý do từ chối'

  // Get Config
  const config = await DB.Config.findOne({}).select('yuan') as IDBConfig
  const yuan = config.yuan

  // Get Payment
  const payment = await DB.GameChinaPayment.findOne({ game: game._id, _id: _id }) as IDBGameChinaPayment
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get User Game
  const userGame = await DB.GameChinaUser.findOne({ game: game._id, _id: payment.user }).select('user') as IDBGameChinaUser
  if(!userGame) throw 'Chưa có dữ liệu chơi game'

  // Get Other
  const bot = await DB.User.findOne({'username': 'bot'}).select('_id') as IDBUser
  if(!bot) throw 'Không tìm thấy thông tin Bot'
  const user = await DB.User.findOne({ _id: userGame.user }).select('_id') as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'
  

  // Update Payment
  const time = new Date()
  const verify_person = status == 3 ? user._id : (!!verifier ? verifier : bot._id)
  await DB.GameChinaPayment.updateOne({ _id: _id }, {
    status: status,
    verify: {
      person: verify_person,
      time: time,
      reason: reason
    }
  })

  // Check Status
  if(status == 1){
    // Update revenue game
    await DB.GameChina.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': payment.coin }})

    const yuanReceive =  payment.coin / yuan

    // Create Collab Income
    await createCollabIncome(event, {
      type: 'game.china.payment',
      user: user._id,
      content: `Nạp tệ <b>[Game China] ${game.name}</b>`,
      coin: payment.coin,

      game: game._id,
      source: payment._id,
    })

    logUser({ 
      user: user._id, 
      action: `
        Dùng <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu nạp thành công <b>${yuanReceive.toLocaleString('vi-VN')}</b> Tệ 
        vào <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
      `, 
      type: 'game.china.pay.success',
      target: game._id.toString()
    })

    logAdmin(event, `Chấp nhận giao dịch nạp tệ <b>${payment.code}</b>`, verify_person)
    logGameAdmin(event, 'china', game._id, `Chấp nhận giao dịch nạp tệ <b>${payment.code}</b>`, verify_person)
  }
  if(status == 2){
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': payment.coin }})
    
    logUser({ 
      user: user._id, 
      action: `
        Hoàn lại <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
        vì bị từ chối giao dịch nạp tệ 
        <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
      `, 
      type: 'game.china.pay.refuse',
      target: game._id.toString()
    })

    logAdmin(event, `Từ chối giao dịch nạp tệ <b>${payment.code}</b>`, verify_person)
    logGameAdmin(event, 'china', game._id, `Từ chối giao dịch nạp tệ <b>${payment.code}</b>`, verify_person)
  }
  if(status == 3){
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': payment.coin }})

    logUser({ 
      user: user._id, 
      action: `
        Hoàn lại <b>${payment.coin.toLocaleString('vi-VN')}</b> Xu 
        từ lệnh hoàn tác giao dịch nạp tệ 
        <b>[Game China] ${game.name}</b>, mã giao dịch <b>${payment.code}</b>
      `, 
      type: 'game.china.pay.undo',
      target: game._id.toString()
    })
  }
}