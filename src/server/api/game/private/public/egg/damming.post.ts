import type { IDBUser, IAuth, IDBGamePrivate, IDBGamePrivateUser, IDBGamePrivateEgg } from "~~/types"

const rowFormatNumber = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }
const numberFormatRow = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' }

const getRandomGift = (list : Array<any>) : any => {
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
    const { row, index, server, role, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!server || !role || !row || !index) throw 'Dữ liệu đầu vào sai'

    // @ts-expect-error
    const rowNumber = rowFormatNumber[row]
    if(rowNumber > 6 || rowNumber < 1) throw 'Hàng chọn không hợp lệ'
    if(1 > index || index > rowNumber) throw 'Trứng chọn không hợp lệ'

    // Check Game
    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('name ip api secret rate collab') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'

    // Check User Game
    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: user._id }).select('egg') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi đập trứng'

    // Get Config Egg
    const configEgg = await DB.GamePrivateEgg.findOne({ game: game._id })
    .select(`${row}`) 
    .populate({ path: `${row}.gift.item`, select: 'item_id item_name item_image type' }) as IDBGamePrivateEgg
    if(!configEgg) throw 'Không tìm thấy cấu hình đập trứng'
    // @ts-expect-error
    if(!configEgg[row]) throw 'Không tìm thấy cấu hình hàng chọn không hợp lệ'
    // @ts-expect-error
    const price = configEgg[row]['price']
    if(!price) throw 'Không lấy được cấu hình giá đập của hàng chọn'
    const minus = getCoinMinus(user.currency, price)
    // @ts-expect-error
    const gift = configEgg[row]['gift']
    if(!gift) throw 'Không lấy được cấu hình phần thưởng của hàng chọn'
    if(gift.length == 0) throw 'Hàng này chưa có phần thưởng, vui lòng quay lại sau'

    // Get Egg User
    const eggUser = userGame.egg
    if(!eggUser) throw 'Không lấy được dữ liệu tháp trứng, vui lòng tải lại trang'
    
    // Check Row Down
    if(rowNumber < 6){
      const rowDownNumber = rowNumber + 1
      // @ts-expect-error
      const rowDownUser = eggUser[numberFormatRow[rowDownNumber]]
      if(rowDownUser.length != rowDownNumber) throw 'Vui lòng mở hết hàng dưới trước'
    }

    // Check Had Open
    // @ts-expect-error
    const indexCheck = eggUser[row].findLastIndex((i : any) => i.index == index)
    if(indexCheck >= 0) throw 'Quả trứng này bạn đã mở rồi'

    // Random Gift
    const resultGift = getRandomGift(gift)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'
    
    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Egg',
      content: 'Vật phẩm nhận từ sự kiện đập trứng trên Web',
      items: [{ id: resultGift.item.item_id, amount: resultGift.amount }]
    })

    // History
    const history = await DB.GamePrivateEggHistory.create({
      game: game._id,
      user: userGame._id,
      row: row,
      index: index,
      item: resultGift.item._id,
      amount: resultGift.amount,
      percent: resultGift.percent,
      server: server,
      role: role,
    })

    // Update User
    await DB.User.updateOne({ _id: user._id },{ $inc: { 
      'currency.coin': minus.coin * -1,
      'currency.lcoin': minus.lcoin * -1,
    }})
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
    if(rowNumber == 1 && index == 1) await DB.GamePrivateUser.updateOne(
      { game: game._id, user: user._id }, 
      { egg: { one: [], two: [], three: [], four: [], five: [], six: [] } }
    )
    else await DB.GamePrivateUser.updateOne(
      { game: game._id, user: user._id }, 
      { $push: { [`egg.${row}`]: { index: index, history: history._id } }}
    )

    // Update Game Revenue
    minus.coin > 0 && await DB.GamePrivate.updateOne({ _id: game._id }, { $inc: { 'statistic.revenue': minus.coin }})

    // Create Collab Income
    minus.coin > 0 && await createCollabIncome(event, {
      type: 'game.private.egg.damming',
      user: user._id,
      content: `Đập trứng trong sự kiện của <b>[Game Private] ${game.name}</b>`,
      coin: minus.coin,

      game: game._id,
      source: history._id,
      commissionGame: game.collab.commission
    })

    // Log User
    logUser({
      user: auth._id,
      // @ts-expect-error
      action: `Dùng <b>${price.toLocaleString("vi-VN")} Xu</b> để đập trứng <b>Hàng ${rowFormatNumber[row]} - ${index}</b> trong <b>[Game Private] ${game.name}</b>`,
      type: 'game.private.egg.damming',
      target: game._id.toString()
    })

    // Socket Update Auth
    IO.to(user._id.toString()).emit('auth-update')

    return resp(event, { result: resultGift })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})