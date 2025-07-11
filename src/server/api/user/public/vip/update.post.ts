import type { IAuth, IDBConfig, IDBUser } from "~~/types"
const vipTypes = ['month', 'forever']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { type } = body
    if(!type) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!vipTypes.includes(type)) throw 'Gói nâng cấp VIP không hỗ trợ'
    
    const config = await DB.Config.findOne({}).select('vip') as IDBConfig
    // @ts-expect-error
    const price = auth.type != 100 ? config.vip[type] : 0 // Admin Free

    const user = await DB.User.findOne({ _id: auth._id })
    .select(profileSelect(['currency']).user)
    .populate(profileSelect().level)
    .populate(profileSelect().guild) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(!!user.vip.forever.enable) throw 'Bạn đã nâng cấp lên đặc quyền VIP Trọn Đời, không thể nâng cấp thêm'
    if(user.currency.coin < price) throw 'Số dư Xu không đủ'

    if(type == 'forever'){
      user.vip.month.enable = false
      user.vip.month.end = null
      user.vip.forever.enable = true
    }
    if(type == 'month'){
      const now = DayJS(!!user.vip.month.end ? new Date(user.vip.month.end) : Date.now())
      const end = now.add(30, 'day')
      user.vip.month.enable = true
      user.vip.month.end = end
    }

    // Update User
    await user.save()
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': price * -1 }})

    // Create Collab Income
    price > 0 && await createCollabIncome(event, {
      type: 'vip.upgrade',
      user: user._id,
      content: `Nâng VIP <b>${type == 'forever' ? 'Trọn Đời' : 'Tháng'}</b> cho tài khoản`,
      coin: price
    })

    // Log User
    logUser({
      user: user._id,
      action: `Dùng <b>${price.toLocaleString('vi-VN')} Xu</b> mua <b>VIP ${type == 'forever' ? 'Trọn Đời' : 'Tháng'}</b>`,
      type: `vip.upgrade`,
      target: type
    })

    // Notify Global
    IO.emit('notify-global-push', {
      user: user,
      content: `vừa nâng cấp lên <b>VIP ${type == 'forever' ? 'Trọn Đời' : 'Tháng'}</b>`
    })

    return resp(event, { message: 'Nâng cấp thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})