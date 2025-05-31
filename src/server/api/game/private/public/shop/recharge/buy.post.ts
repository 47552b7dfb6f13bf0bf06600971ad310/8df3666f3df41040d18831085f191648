import type { IAuth, IDBUser, IDBGamePrivate, IDBGamePrivateRecharge, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, recharge : rechargeID, server, role } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!rechargeID) throw 'Không tìm thấy mã gói nạp'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'

    const user = await DB.User.findOne({ _id: auth._id }).select('currency vip') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('name ip api secret rate collab') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('currency') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    const recharge = await DB.GamePrivateRecharge.findOne({ _id: rechargeID, game: game._id, display: true }) as IDBGamePrivateRecharge
    if(!recharge) throw 'Gói nạp game không tồn tại'

    // Get Price
    const price = recharge.price

    // Get Discount Game
    let discountGame = formatRate(game.rate.shop)
    discountGame = discountGame > 100 ? 100 : discountGame

    // Get Discount VIP
    const vip = await getUserVip(user) as string
    // @ts-expect-error
    const discountVIP = !!vip ? game.rate.shop.vip[vip] : 0

    // Make Discount
    let discount = discountGame + discountVIP
    discount = discount > 100 ? 100 : discount

    // Make Price and Spend
    let totalPrice = price - Math.floor(price * (discount / 100)) // Giá mua
    let totalSpend = price - Math.floor(price * (discountGame / 100)) // Tích tiêu phí (Không tính giảm giá VIP)
    if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free Only Prod

    // Check Currency
    if(user.currency.coin < totalPrice) throw 'Số dư xu không đủ'

    // Send Recharge
    await gameSendRecharge(event, {
      url: game.api.recharge,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      recharge_id: recharge.recharge_id,
      save_pay: recharge.save_pay
    })

    // Update User
    totalPrice > 0 && await DB.User.updateOne({ _id: auth._id }, { $inc: { 'currency.coin': totalPrice * -1 }})
    await DB.GamePrivateUser.updateOne({ _id: userGame._id },{ $inc: {
      'spend.day.coin': totalSpend,
      'spend.week.coin': totalSpend,
      'spend.month.coin': totalSpend,
      'spend.total.coin': totalSpend,
      'spend.day.count': 1,
      'spend.week.count': 1,
      'spend.month.count': 1,
      'spend.total.count': 1,
    }})

    // Update Revenue
    totalPrice > 0 && await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': totalPrice }})

    // History
    const history = await DB.GamePrivateRechargeHistory.create({
      user: userGame._id,
      game: game._id,
      recharge: recharge._id,
      price: totalPrice,
      server: server,
      role: role,
    })

    // Create Collab Income
    totalPrice > 0 && await createCollabIncome(event, {
      type: 'game.private.shop.recharge',
      user: user._id,
      content: `Mua hàng trong <b>[Game Private] ${game.name}</b>`,
      coin: totalPrice,

      game: game._id,
      source: history._id,
      commissionGame: game.collab.commission
    })

    // Log User
    logUser({
      user: auth._id,
      action: `Dùng <b>${totalPrice.toLocaleString("vi-VN")} Xu</b> mua hàng trong <b>[Game Private] ${game.name}</b>`,
      type: 'game.private.shopping',
      target: game._id.toString()
    })

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})