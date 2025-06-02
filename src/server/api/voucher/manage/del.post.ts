import type { IAuth, IDBVoucher } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const voucher = await DB.Voucher.findOne({ _id: _id }).select('title') as IDBVoucher
    if(!voucher) throw 'Thẻ này không tồn tại'

    await DB.VoucherHistory.deleteMany({ voucher: voucher._id })
    await DB.Voucher.deleteOne({ _id: voucher._id })
    await DB.User.updateMany({}, { $pull: { 'vouchers': voucher._id } })
    
    logAdmin(event, `Xóa thẻ quà tặng <b>${voucher.title}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})