import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id, collab : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ code: code }).select('user privilege') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác với kênh thanh toán'
    if(auth.type < 100 && !collab.privilege.edit_gate) throw 'Bạn không có quyền thao tác với kênh thanh toán'

    const gate = await DB.Gate.findOne({ _id: _id }).select('name')
    if(!gate) throw 'Kênh không tồn tại'

    const payments = await DB.Payment.count({ gate: _id })
    if(payments > 0) throw 'Không thể xóa kênh đã có giao dịch'

    await DB.Gate.deleteOne({ _id: _id })

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})