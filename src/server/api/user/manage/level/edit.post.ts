import type { IAuth, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('user.level.edit', auth.type)

    const body = await readBody(event)
    const { _id, title, exp, limit, bonus, gift, voucher } = body
    if(!_id || !title || !limit || !bonus || !gift || !voucher) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(exp) || exp < 0) throw 'Cấp độ không hợp lệ'

    const level = await DB.UserLevel.findOne({ _id: _id }).select('number') as IDBUserLevel
    if(!level) throw 'Cấp độ không tồn tại'

    delete body['_id']
    await DB.UserLevel.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin cấp độ <b>${level.number}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})