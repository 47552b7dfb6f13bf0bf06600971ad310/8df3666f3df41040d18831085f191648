import type { IAuth, IDBCollabWithdraw } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.withdraw.action', auth.type)

    const { _id, status, reason } = await readBody(event)
    if(!_id || !status) throw 'Dữ liệu đầu vào không đủ'
    if(status == 2 && !reason) throw 'Vui lòng nhập lý do'

    const withdraw = await DB.CollabWithdraw.findOne({ _id: _id }) as IDBCollabWithdraw
    if(!withdraw) throw 'Lệnh không tồn tại'
    if(withdraw.status > 0) throw 'Không thể thao tác trên lệnh này'

    const time = new Date()
    const verify_person = auth._id
    await DB.CollabWithdraw.updateOne({ _id: withdraw._id }, {
      status: status,
      verify: {
        person: verify_person,
        time: time,
        reason: reason
      }
    })

    let logAction : any
    if(status == 1){
      logAction = `
        Được duyệt thành công lệnh rút tiền thu nhập CTV số tiền
        <b>${withdraw.money.toLocaleString('vi-VN')} VNĐ</b>, mã giao dịch <b>${withdraw.code}</b>
      `
  
      logAdmin(event, `Chấp nhận giao dịch rút <b>${withdraw.money.toLocaleString('vi-VN')} VNĐ</b> của CTV với mã <b>${withdraw.code}</b>`, verify_person)
    }
    if(status == 2){
      await DB.Collab.updateOne({ _id: withdraw.collab }, { $inc: { 'money': withdraw.money }})

      logAction = `
        Bị từ chối lệnh rút tiền thu nhập CTV mã giao dịch <b>${withdraw.code}</b>,
        với lý do <b>${reason}</b> 
      `

      logAdmin(event, `Từ chối giao dịch rút tiền của CTV với mã <b>${withdraw.code}</b>`, verify_person)
    }

    logUser({
      user: withdraw.user,
      action: logAction,
      type: 'collab.withdraw.verify'
    })
    
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})