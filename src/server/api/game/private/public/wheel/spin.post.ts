import type { IDBUser, IAuth, IDBGamePrivate, IDBGamePrivateWheel, IDBGamePrivateItem, IDBGamePrivateUser } from "~~/types"


const getRandomGift = (list : Array<IDBGamePrivateWheel>) : IDBGamePrivateWheel => {
  // Get Random
  let totalPercent = 0
  let rand = 0

  totalPercent = list.reduce((accumulator, object) => {
    return parseFloat(String(accumulator)) + parseFloat(String(object.percent))
  }, 0)
  totalPercent = totalPercent
  rand = Math.random() * totalPercent

  // Get Chances
  const chances : Array<number> = []
  let acc = 0
  list.forEach(i => {
    acc = parseFloat(String(acc)) + (parseFloat(String(i.percent)))
    chances.push(acc)
  })

  // Get Index
  let index : number = 0
  chances.forEach(i => {
    if(i <= rand){
      index = index + 1
    }
  })

  return list[index]
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { server, role, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!server || !role) throw 'Dữ liệu đầu vào sai'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('name ip api secret rate collab') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    const price : any = game.rate.wheel || 10000

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(user.currency.coin < price) throw 'Số dư xu của bạn không đủ'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: user._id }).select('egg') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước quay vòng quay'

    // List Gift
    const list = await DB.GamePrivateWheel
    .find({ display: true, game: game._id })
    .select('item amount percent updatedAt')
    .sort({ updatedAt: -1 }) as Array<IDBGamePrivateWheel>
    if(list.length == 0) throw 'Vòng quay hiện chưa có phần thưởng để bắt đầu'

    // Get Random Gift
    const resultGift = getRandomGift(list)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

    // Get Item
    const item = await DB.GamePrivateItem
    .findOne({ _id: resultGift.item, game: game._id })
    .select('item_id item_name item_image type') as IDBGamePrivateItem
    if(!item) throw 'Phần thưởng không tồn tại'

    // Send Item
    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Wheel',
      content: 'Vật phẩm nhận từ sự kiện vòng quay may mắn trên Web',
      items: [{ id: item.item_id, amount: resultGift.amount }]
    })

    // History
    const history = await DB.GamePrivateWheelHistory.create({
      game: game._id,
      user: userGame._id,
      item: item._id,
      server: server,
      role: role,
      amount: resultGift.amount,
      percent: resultGift.percent
    })
    
    // Update User
    price > 0 && await DB.User.updateOne({ _id: user._id },{ $inc: { 'currency.coin': parseInt(price) * -1 }})
    await DB.GamePrivateUser.updateOne({ game: game._id, user: user._id },{ $inc: {
      'spend.day.coin': price,
      'spend.week.coin': price,
      'spend.month.coin': price,
      'spend.total.coin': price,
      'spend.day.count': 1,
      'spend.week.count': 1,
      'spend.month.count': 1,
      'spend.total.count': 1,
    }})

    // Update Game Revenue
    price > 0 && await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': price }})

    // Create Collab Income
    price > 0 && await createCollabIncome(event, {
      type: 'game.private.wheel.spin',
      user: user._id,
      content: `Quay vòng quay trong sự kiện của <b>[Game Private] ${game.name}</b>`,
      coin: price,

      game: game._id,
      source: history._id,
      commissionGame: game.collab.commission
    })

    // Log User
    logUser({
      user: user._id,
      action: `Dùng <b>${price.toLocaleString("vi-VN")} Xu</b> để quay vòng quay trong <b>[Game Private] ${game.name}</b>`,
      type: 'game.private.wheel.spin',
      target: game._id.toString()
    })

    // Socket Update Auth
    IO.to(user._id.toString()).emit('auth-update')

    return resp(event, { result: {
      _id: resultGift._id,
      item: item,
      amount: resultGift.amount,
      percent: resultGift.percent,
    } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})