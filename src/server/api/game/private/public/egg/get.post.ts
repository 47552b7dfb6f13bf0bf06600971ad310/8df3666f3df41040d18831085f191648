import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const config = await DB.GamePrivateEgg.findOne({ game: game._id }).select(`one.price two.price three.price four.price five.price six.price`)
    if(!config) throw 'Không tìm thấy thông tin cấu hình'

    let source
    const auth = await getAuth(event, false) as IAuth
    if(!auth) source = { one: [], two: [], three: [], four: [], five: [], six: [] }
    else {
      // Check User Game
      const userGame = await DB.GamePrivateUser
      .findOne({ game: game._id, user: auth._id })
      .select('egg') 
      .populate({ path: 'egg.one.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'egg.two.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'egg.three.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'egg.four.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'egg.five.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'egg.six.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }}) as IDBGamePrivateUser
      if(!userGame) throw 'Vui lòng chơi game trước khi chơi'
      else {
        // Chưa có cấu hình trứng
        if(!userGame.egg){ 
          source = { one: [], two: [], three: [], four: [], five: [], six: [] }
          userGame.egg = source
          await userGame.save()
        }
        // Đã có cấu hình trứng
        else { 
          source = userGame.egg
        }
      }
    }

    return resp(event, { result: { config, source } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})