import type { IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { game : code, server } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!server) throw 'Không tìm thấy mã máy chủ'

    const game = await DB.GamePrivate.findOne({ code: code }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const processEvent = await DB.GamePrivateRank
    .findOne({ game: game._id, server: server, type: 'power' })
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'})
    if(!processEvent) throw 'Chưa có sự kiện đua TOP ở máy chủ này'

    return resp(event, { result: processEvent })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})