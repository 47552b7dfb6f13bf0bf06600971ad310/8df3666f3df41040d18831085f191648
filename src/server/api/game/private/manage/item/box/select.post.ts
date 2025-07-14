import type { IAuth, IDBGamePrivate } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const match : any = { game: new Types.ObjectId(game._id) }

    const list = await DB.GamePrivateItemBox
    .find(match)
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})