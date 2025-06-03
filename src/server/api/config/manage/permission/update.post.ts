import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const data = await readBody(event)
    await DB.ConfigPermission.updateMany({}, data)

    logAdmin(event, 'Cập nhật cấu hình <b>Quyền Hạn Quản Trị Viên</b>')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})