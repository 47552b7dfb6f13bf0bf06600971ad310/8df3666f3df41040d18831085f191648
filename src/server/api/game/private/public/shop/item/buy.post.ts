import type { IAuth, IDBGamePrivate, IDBGamePrivateItem, IDBGamePrivateShopItem, IDBGamePrivateUser, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, shop : shopItemID, amount, server, role, voucher } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!shopItemID) throw 'Không tìm thấy mã vật phẩm bày bán'
    if(!server || !role) throw 'Vui lòng chọn máy chủ và nhân vật'
    if(!isNumber(amount) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(amount > 1000) throw 'Số lượng không vượt quá 1000'

    const user = await DB.User.findOne({ _id: auth._id }).select('currency vip vouchers') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('name ip api secret rate collab') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('_id') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi trò chơi trước khi mua'

    const shopItem = await DB.GamePrivateShopItem.findOne({ _id: shopItemID, game: game._id, display: true }) as IDBGamePrivateShopItem
    if(!shopItem) throw 'Vật phẩm bày bán không tồn tại'

    const item = await DB.GamePrivateItem.findOne({ _id: shopItem.item, game: game._id }).select('item_id') as IDBGamePrivateItem
    if(!item) throw 'Vật phẩm trò chơi không tồn tại'

    // Get Price
    const price = shopItem.price * parseInt(amount)

    // Get Discount Voucher
    const discountVoucher = await getValueVoucher(user, voucher)

    // Get Discount Game
    let discountGame = formatRate(game.rate.shop)
    discountGame = discountGame > 100 ? 100 : discountGame

    // Get Discount VIP
    const vip = await getUserVip(user) as string
    // @ts-expect-error
    const discountVIP = !!vip ? game.rate.shop.vip[vip] : 0

    // Make Discount
    let discount = discountGame + discountVIP + discountVoucher
    discount = discount > 100 ? 100 : discount

    // Make Price and Spend
    let totalPrice = price - Math.floor(price * (discount / 100)) // Giá mua
    let totalSpend = price - Math.floor(price * (discountGame / 100)) // Tích tiêu phí (Không tính giảm giá VIP và Voucher)
    if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free

    // Check Currency
    const minus = getCoinMinus(user.currency, totalPrice)

    // Check Limit Buy
    if(shopItem.limit > 0){
      const countBuy = await DB.GamePrivateShopItemHistory.count({ 
        game: game._id,
        user: userGame._id, 
        item: item._id, 
        server: server,
        role: role
      })
      if(countBuy >= shopItem.limit) throw `Bạn đã đạt giới hạn mua vật phẩm này cho nhân vật của máy chủ này`
    }

    // Send Recharge
    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Shop',
      content: 'Vật phẩm mua từ Web Shop',
      items: [{ id: item.item_id, amount: parseInt(amount) * (shopItem.amount || 1) }]
    })

    // History
    const history = await DB.GamePrivateShopItemHistory.create({
      user: userGame._id,
      game: game._id,
      item: item._id,
      price: totalPrice,
      amount: amount,
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

    // Update Voucher
    if(discountVoucher > 0){
      await DB.User.updateOne({ _id: user._id }, { $pull: { 'vouchers': voucher } })
      await DB.VoucherHistory.create({ voucher: voucher, user: user._id, content: `Mua hàng trong <b>[Game Private] ${game.name}</b>` })
    }

    // Update Revenue
    minus.coin > 0 && await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': minus.coin }})

    // Create Collab Income
    minus.coin > 0 && await createCollabIncome(event, {
      type: 'game.private.shop.item',
      user: user._id,
      content: `Mua hàng trong <b>[Game Private] ${game.name}</b>`,
      coin: minus.coin,

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

    // Socket Update Auth
    IO.to(user._id.toString()).emit('auth-update')

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})