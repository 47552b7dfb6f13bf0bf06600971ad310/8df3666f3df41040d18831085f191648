import type { IAuth, IDBGamePrivate, IDBGamePrivateEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    
    const { game : gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)
    
    const config = await DB.GamePrivateEgg
    .findOne({ game: game._id })
    .populate({ path: 'one.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'two.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'three.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'four.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'five.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'six.gift.item', select: 'item_id item_name item_image type' }) as IDBGamePrivateEgg
    if(!config) {
      const newConfig = await DB.GamePrivateEgg.create({ game: game._id }) as IDBGamePrivateEgg
      return resp(event, { result: newConfig })
    }
    else {
      return resp(event, { result: config })
    }
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})