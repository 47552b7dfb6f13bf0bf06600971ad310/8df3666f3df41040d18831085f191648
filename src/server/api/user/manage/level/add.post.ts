import type { IAuth, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('user.level.add', auth.type)

    const body = await readBody(event)
    const { number, title, exp } = body
    if(!number || !title) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(exp) || exp < 0) throw 'Kinh nghiệm không hợp lệ'
    if(!isNumber(number) || number < 1 || number > 15) throw 'Cấp độ trong khoảng từ 1 - 15'

    const level = await DB.UserLevel.findOne({ number: number }).select('number') as IDBUserLevel
    if(!!level) throw 'Cấp độ đã tồn tại'

    await DB.UserLevel.create(body)

    logAdmin(event, `Thêm cấp độ tài khoản <b>${number}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})