import type { IAuth, IDBECoinShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('ecoin.shop.edit', auth.type)

    const body = await readBody(event)
    const { _id, name, price } = body
    if(!_id || !name || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(price) || price < 0) throw 'Giá mua không hợp lệ'

    const shop = await DB.ECoinShop.findOne({ _id: _id }).select('name') as IDBECoinShop
    if(!shop) throw 'Sản phẩm không tồn tại'

    if(shop.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.ECoinShop.findOne({ key: key }).select('_id') as IDBECoinShop
      if(!!getByKey) throw 'Tên sản phẩm đã tồn tại'
      body.key = key
    }

    delete body['_id']
    await DB.ECoinShop.updateOne({ _id: _id }, body)
    logAdmin(event, `Sửa thông tin sản phẩm <b>${shop.name}</b> trong cửa hàng ECoin`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})