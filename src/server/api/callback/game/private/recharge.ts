import type { IDBUser, IDBGamePrivate, IDBGamePrivateRecharge, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const body = await readBody(event)

    const { account, code : gameCode, item_id, item_name, price, save_pay, server, role } = body
    if(!gameCode) throw 'Không tìm thấy mã trò chơi'
    if(!item_id || !item_name || !price) throw 'Gói nạp không hợp lệ'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'

    const user = await DB.User.findOne({ username: account }).select('currency vip type') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GamePrivate.findOne({ code: gameCode, display: true }).select('name ip api secret rate collab') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: user._id }).select('currency') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    let recharge = await DB.GamePrivateRecharge.findOne({ recharge_id: item_id, game: game._id}) as IDBGamePrivateRecharge
    if(!recharge){
      recharge = await DB.GamePrivateRecharge.create({ 
        game: game._id,
        recharge_id: item_id,
        recharge_name: item_name,
        save_pay: save_pay || price,
        price: price,
      })
    }

    // Get Price
    const realPrice = recharge.price

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
    let totalPrice = realPrice - Math.floor(realPrice * (discount / 100)) // Giá mua
    let totalSpend = realPrice - Math.floor(realPrice * (discountGame / 100)) // Tích tiêu phí (Không tính giảm giá VIP và Voucher)
    if(!runtimeConfig.public.dev && user.type == 100) totalPrice = 0 // Admin Free

    // Check Currency
    const minus = getCoinMinus(user.currency, totalPrice)

    // Send Recharge
    await gameSendRecharge(event, {
      url: game.api.recharge,
      secret: game.secret,
      account: user.username,
      server_id: server,
      role_id: role,
      recharge_id: recharge.recharge_id,
      save_pay: recharge.save_pay
    })

    // History
    const history = await DB.GamePrivateRechargeHistory.create({
      user: userGame._id,
      game: game._id,
      recharge: recharge._id,
      price: totalPrice,
      server: server,
      role: role,
    })

    // Update User
    await DB.User.updateOne({ _id: user._id },{ $inc: { 
      'currency.coin': minus.coin * -1,
      'currency.lcoin': minus.lcoin * -1,
    }})
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
    minus.coin > 0 && await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': minus.coin }})

    // Create Collab Income
    minus.coin > 0 && await createCollabIncome(event, {
      type: 'game.private.shop.recharge',
      user: user._id,
      content: `Mua hàng trong <b>[Game Private] ${game.name}</b>`,
      coin: minus.coin,

      game: game._id,
      source: history._id,
      commissionGame: game.collab.commission
    })

    // Log User
    logUser({
      user: user._id,
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