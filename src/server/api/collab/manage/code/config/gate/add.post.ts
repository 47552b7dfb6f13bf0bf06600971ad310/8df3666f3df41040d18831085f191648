import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { collab : code, type, name, person, number } = body
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
    if(!type || !name || !person || !number) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 1 || type > 3) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ code: code }).select('user privilege') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác với kênh thanh toán'
    if(auth.type < 100 && !collab.privilege.edit_gate) throw 'Bạn không có quyền thao tác với kênh thanh toán'

    body['collab'] = collab._id
    await DB.Gate.create(body)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})