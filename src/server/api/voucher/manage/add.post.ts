import type { IAuth } from "~~/types"

const typeSupport = ['DISCOUNT', 'DISCOUNT-COIN', 'PAYMENT']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('voucher.add', auth.type)

    const body = await readBody(event)
    const { type, title, value, limit } = body
    if(!type || !title) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!typeSupport.includes(type)) throw 'Kiểu thẻ không hỗ trợ'
    if(!isNumber(limit) || limit < 0) throw 'Giới hạn phải lớn hơn hoặc bằng 0'
    if(!isNumber(value) || value < 1) throw 'Giá trị thẻ phải lớn hơn 0'
    if(type == 'DISCOUNT' && value > 100) throw 'Giá trị thẻ không quá 100%'

    await DB.Voucher.create(body)

    logAdmin(event, `Thêm thẻ quà tặng <b>${title}</b> với giá trị <b>${value.toLocaleString("vi-VN")}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})