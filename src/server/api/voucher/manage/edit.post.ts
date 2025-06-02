import type { IAuth, IDBVoucher } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { _id, type, title, value, limit } = body
    if(!_id || !type || !title) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(limit) || limit < 0) throw 'Giới hạn phải lớn hơn hoặc bằng 0'
    if(!isNumber(value) || value < 1) throw 'Giá trị thẻ phải lớn hơn 0'
    if(value > 100) throw 'Giá trị thẻ không quá 100'

    const voucher = await DB.Voucher.findOne({ _id: _id }).select('title') as IDBVoucher
    if(!voucher) throw 'Thẻ này không tồn tại'

    delete body['_id']
    await DB.Voucher.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thẻ quà tặng <b>${voucher.title}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})