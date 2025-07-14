import type { IAuth, IDBCollab, IDBCollabLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.edit', auth.type)

    const body = await readBody(event)
    const { _id, money } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ _id: _id }).select('code') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    await DB.Collab.updateOne({ _id: collab._id }, { $inc: { 'gatepay': money }})
    await DB.CollabNotify.create({
      collab: collab._id,
      title: 'Cập nhật số dư thanh toán',
      content: `Đã được thêm <b>${money.toLocaleString("vi-VN")}</b> VNĐ vào số dư thanh toán`,
      type: 'gatepay.add'
    })
    
    await logAdmin(event, `Thêm ${money.toLocaleString("vi-VN")} vào số dư thanh toán cho cộng tác viên mã <b>${collab.code}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})