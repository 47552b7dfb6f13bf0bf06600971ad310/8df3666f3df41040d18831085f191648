import type { IAuth, IDBUser, IDBGameToolUser, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth

    const user = await DB.User.findOne({ _id: auth._id }).select('username currency vip') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    const { game : code, recharge, mail, server_id } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!server_id) throw 'Vui lòng chọn máy chủ sử dụng'
    if(!recharge && !mail) throw 'Vui lòng lựa chọn 1 loại tool để mua'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('name price discount collab') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GameToolUser.findOne({ game: game._id, user: user._id, server_id: server_id }) as IDBGameToolUser
    let totalPrice = 0
    let discount = 0
    let payment : any
    let result : any 

    // Discount VIP
    const vip = await getUserVip(user) as string
    // @ts-expect-error
    discount = !!vip ? game.discount.vip[vip] : 0

    // No User Game Tool
    if(!userGame){
      const newUserGame = { user: user._id, game: game._id, server_id: server_id, recharge: false, mail: false, coin: 0 }
      if(!!recharge) {
        totalPrice = totalPrice + game.price.recharge
        newUserGame.recharge = true
      }
      if(!!mail) {
        totalPrice = totalPrice + game.price.mail
        newUserGame.mail = true
      }

      totalPrice = totalPrice - Math.floor((totalPrice * discount) / 100)

      if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free
      if(user.currency.coin < totalPrice) throw 'Số dư xu không đủ'

      newUserGame.coin = totalPrice
      const newUserGameData = await DB.GameToolUser.create(newUserGame)

      await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': totalPrice * -1 }})
      await DB.GameTool.updateOne({ _id: game._id }, { $inc: { 'statistic.user': 1 } })
      payment = await DB.GameToolPayment.create({
        user: newUserGameData._id,
        game: game._id,
        coin: totalPrice
      })
      result = { recharge: newUserGame.recharge, mail: newUserGame.mail }
    }
    
    // Has User Game Tool
    if(!!userGame){
      if(!!userGame.recharge && !!userGame.mail) throw 'Bạn đã mua tất cả tool của trò chơi này'
      if(!!recharge && !userGame.recharge) totalPrice = totalPrice + game.price.recharge
      if(!!mail && !userGame.mail) totalPrice = totalPrice + game.price.mail

      totalPrice = totalPrice - Math.floor((totalPrice * discount) / 100)

      if(!runtimeConfig.public.dev && auth.type == 100) totalPrice = 0 // Admin Free
      if(user.currency.coin < totalPrice) throw 'Số dư xu không đủ'

      if(!!recharge && !userGame.recharge) userGame.recharge = true
      if(!!mail && !userGame.mail) userGame.mail = true
      userGame.coin = userGame.coin + totalPrice

      // @ts-expect-error
      await userGame.save()
      await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': totalPrice * -1 }})
      payment = await DB.GameToolPayment.create({
        user: userGame._id,
        game: game._id,
        coin: totalPrice
      })
      result = { recharge: userGame.recharge, mail: userGame.mail }
    }

    // Update revenue game
    totalPrice > 0 && await DB.GameTool.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': totalPrice }})

    // Create Collab Income
    totalPrice > 0 && await createCollabIncome(event, {
      type: 'game.tool.buy',
      user: user._id,
      content: `Mua công cụ <b>[Game Tool] ${game.name}</b>`,
      coin: totalPrice,

      game: game._id,
      source: payment._id,
      commissionGame: game.collab.commission
    })

    // Log User
    logUser({
      user: auth._id,
      action: `Dùng <b>${totalPrice.toLocaleString("vi-VN")} Xu</b> mua công cụ <b>[Game Tool] ${game.name}</b> trên máy chủ <b>${server_id}</b>`,
      type: 'game.tool.buy',
      target: game._id.toString()
    })

    return resp(event, { message: 'Mua thành công', result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})