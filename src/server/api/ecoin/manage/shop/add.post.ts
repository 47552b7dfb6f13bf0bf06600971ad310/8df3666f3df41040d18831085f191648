import type { IAuth, IDBECoinShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('ecoin.shop.add', auth.type)

    const body = await readBody(event)
    const { name, price } = body
    if(!name || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(price) || price < 0) throw 'Giá mua không hợp lệ'

    const key = formatVNString(name, '-')
    const shopCheck = await DB.ECoinShop.findOne({ key: key }).select('_id') as IDBECoinShop
    if(!!shopCheck) throw 'Tên sản phẩm đã tồn tại'

    body.key = key
    await DB.ECoinShop.create(body)
    logAdmin(event, `Thêm sản phẩm <b>${name}</b> vào cửa hàng ECoin`)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})