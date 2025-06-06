import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('gate.add', auth.type)

    const body = await readBody(event)
    const { type, name, person, number } = body
    if(!type || !name || !person || !number) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 1 || type > 3) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.Gate.create(body)

    logAdmin(event, `Thêm kênh nạp <b>${name}</b>`)
    return resp(event, { message: 'Thêm kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})