import type { IAuth, IDBCollab, IDBCollabWithdraw } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, status, reason, parent } = await readBody(event)
    if(!_id || !status) throw 'Dữ liệu đầu vào không đủ'
    if(status == 2 && !reason) throw 'Vui lòng nhập lý do'
    
    const collabParent = await DB.Collab.findOne({ code: parent }).select('user') as IDBCollab
    if(!collabParent) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collabParent.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
  
    const withdraw = await DB.CollabWithdraw.findOne({ _id: _id, parent: collabParent._id }) as IDBCollabWithdraw
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

    if(status == 1){
      await DB.CollabNotify.create({
        collab: withdraw.collab,
        title: 'Lệnh rút tiền hoàn tất',
        content: `Lệnh rút tiền <b>${withdraw.code}</b> bị được duyệt thành công, vui lòng kiểm tra số dư tài khoản ngân hàng của bạn`,
        type: 'withdraw.success'
      })
    }
    
    if(status == 2){
      await DB.Collab.updateOne({ _id: withdraw.collab }, { $inc: { 'money': withdraw.money }})
      await DB.CollabNotify.create({
        collab: withdraw.collab,
        title: 'Lệnh rút tiền bị từ chối',
        content: `Đã hoàn <b>${withdraw.money.toLocaleString('vi-VN')}</b> VNĐ vào số dư tài khoản từ lệnh rút tiền <b>${withdraw.code}</b> bị từ chối với lý do <b>${reason}</b>`,
        type: 'withdraw.refuse'
      })
    }
    
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})