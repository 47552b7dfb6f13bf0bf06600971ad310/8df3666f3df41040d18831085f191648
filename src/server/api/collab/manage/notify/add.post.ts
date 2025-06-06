import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.notify.add', auth.type)

    const body = await readBody(event)
    const { title } = body
    if(!title) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.CollabNotify.create(body)
    logAdmin(event, `Thêm thông báo nền tảng <b>${title}</b>`)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})