import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { _id, money, parent } = body
    if(!_id || !parent) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(money) || money < 1) throw 'Số tiền không hợp lệ'

    const collabParent = await DB.Collab.findOne({ code: parent }).select('user gatepay') as IDBCollab
    if(!collabParent) throw 'Dữ liệu cộng tác viên cha không tồn tại'
    if(auth.type < 100 && collabParent.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác'
    
    const collab = await DB.Collab.findOne({ _id: _id, parent: collabParent._id }).select('code') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    if(collabParent.gatepay < money) throw 'Số dư kênh thanh toán của bạn không đủ để chia cho CTV nhánh'
    await DB.Collab.updateOne({ _id: collabParent._id }, { $inc: { 'gatepay': money * -1 }})
    await DB.CollabNotify.create({
      collab: collabParent._id,
      title: 'Cập nhật số dư thanh toán',
      content: `Đã trừ <b>${money.toLocaleString('vi-VN')}</b> VNĐ chuyển sang số dư thanh toán cho CTV nhánh <b>${collab.code}</b>`,
      type: 'gatepay.minus'
    })

    await DB.Collab.updateOne({ _id: collab._id }, { $inc: { 'gatepay': money }})
    await DB.CollabNotify.create({
      collab: collab._id,
      title: 'Cập nhật số dư thanh toán',
      content: `Đã được thêm <b>${money.toLocaleString("vi-VN")}</b> VNĐ vào số dư thanh toán`,
      type: 'gatepay.add'
    })
    
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})