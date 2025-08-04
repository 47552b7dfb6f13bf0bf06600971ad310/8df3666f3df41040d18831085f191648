import type { IAuth, IDBUserLevel, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { _id, title, exp, limit, bonus, gift, voucher, collab : code } = body
    if(!_id || !title || !limit || !bonus || !gift || !voucher) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(exp) || exp < 0) throw 'Cấp độ không hợp lệ'

    const collab = await DB.Collab.findOne({ code: code }).select('user privilege') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác'
    if(auth.type < 100 && !collab.privilege.edit_level) throw 'Bạn không có quyền thao tác với cấp độ tài khoản'

    const level = await DB.UserLevel.findOne({ _id: _id, collab: collab._id }).select('number') as IDBUserLevel
    if(!level) throw 'Cấp độ không tồn tại'
    if(level.number == 1 && exp > 0) throw 'Cấp độ 1 kinh nghiệm bắt buộc phải bằng 0'

    delete body['_id']
    delete body['collab']
    await DB.UserLevel.updateOne({ _id: level._id }, body)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})