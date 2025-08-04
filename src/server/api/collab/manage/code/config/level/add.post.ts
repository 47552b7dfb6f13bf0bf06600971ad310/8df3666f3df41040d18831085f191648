import type { IAuth, IDBUserLevel, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { number, title, exp, collab : code  } = body
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
    if(!number || !title) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(exp) || exp < 0) throw 'Kinh nghiệm không hợp lệ'
    if(!isNumber(number) || number < 1 || number > 15) throw 'Cấp độ trong khoảng từ 1 - 15'

    const collab = await DB.Collab.findOne({ code: code }).select('user privilege') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác'
    if(auth.type < 100 && !collab.privilege.edit_level) throw 'Bạn không có quyền thao tác với cấp độ tài khoản'

    const levelOne = await DB.UserLevel.findOne({ number: 1, collab: collab._id }).select('_id') as IDBUserLevel
    if(!levelOne && number != 1) throw 'Vui lòng thêm cấp độ 1 trước'
    if(number == 1 && exp > 0) throw 'Cấp độ 1 kinh nghiệm bắt buộc phải bằng 0'

    const level = await DB.UserLevel.findOne({ number: number, collab: collab._id }).select('number') as IDBUserLevel
    if(!!level) throw 'Cấp độ đã tồn tại'

    body['collab'] = collab._id
    await DB.UserLevel.create(body)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})