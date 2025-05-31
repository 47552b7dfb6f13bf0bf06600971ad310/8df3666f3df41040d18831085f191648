import { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { code } = body
    if(!code) throw 'Không tìm thấy mã cộng tác viên'

    const collab = await DB.Collab.findOne({ code: code }).select('info privilege') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
    if(auth.type < 100 && !collab.privilege.edit_info) throw 'Bạn không có quyền chỉnh sửa thông tin trang cộng tác viên'

    delete body['code']
    await DB.Collab.updateOne({ _id: collab._id }, { info: body })

    IO.emit('web-update', code)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})