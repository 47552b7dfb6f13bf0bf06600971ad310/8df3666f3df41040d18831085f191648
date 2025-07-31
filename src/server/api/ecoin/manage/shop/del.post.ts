import type { IAuth, IDBECoinShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('ecoin.shop.del', auth.type)

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const shop = await DB.ECoinShop.findOne({ _id: _id }).select('name') as IDBECoinShop
    if(!shop) throw 'Sản phẩm không tồn tại'

    const history = await DB.ECoinShopHistory.count({ shop: shop._id })
    if(history > 0) throw 'Không thể xóa sản phẩm đã có lịch sử giao dịch'

    await DB.ECoinShop.deleteOne({ _id: shop._id })
    logAdmin(event, `Xóa sản phẩm <b>${shop.name}</b> khỏi cửa hàng ECoin`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})