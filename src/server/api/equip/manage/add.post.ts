import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('equip.add', auth.type)

    const body = await readBody(event)
    const { name, type, res, power, price } = body
    if(!name || !type || !res) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(power) || power < 0) throw 'Lực chiến không hợp lệ'
    if(!isNumber(price) || price < 0) throw 'Giá mua không hợp lệ'

    await DB.Equip.create(body)

    logAdmin(event, `Thêm trang bị nhân vật <b>${name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})