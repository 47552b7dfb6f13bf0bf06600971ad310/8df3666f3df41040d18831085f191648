import type { IDBUser, IDBVoucher } from "~~/types"
import { Types } from "mongoose"

export default async (user: IDBUser, voucher : Types.ObjectId) : Promise<number> => {
  try {
    if(!voucher) return Promise.resolve(0) 
    if(!user.vouchers.includes(voucher)) throw 'Voucher bạn dùng không có trong kho đồ'
    
    const voucherData = await DB.Voucher.findOne({ _id: voucher, display: true, type: 'DISCOUNT' }).select('limit expired value') as IDBVoucher
    if(!voucherData) throw 'Voucher bạn dùng không tồn tại'

    if(voucherData.limit > 0){
      const countUse = await DB.VoucherHistory.count({ voucher: voucherData._id })
      if(countUse >= voucherData.limit) {
        await DB.User.updateOne({ _id: user._id }, { $pull: { 'vouchers': voucherData._id } })
        throw 'Voucher đã đạt giới hạn sử dụng'
      }
    }
    
    if(!!voucherData.expired){
      const now = DayJS().unix()
      const expired = DayJS(voucherData.expired).unix()
      if(now > expired) {
        await DB.User.updateOne({ _id: user._id }, { $pull: { 'vouchers': voucherData._id } })
        throw 'Voucher đã hết hạn sử dụng'
      }
    }

    return Promise.resolve(voucherData.value) 
  }
  catch (e:any) {
    throw e
  }
}