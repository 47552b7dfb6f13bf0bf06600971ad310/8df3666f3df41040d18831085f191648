import type { IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { type, game: code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!type) throw 'Kiểu sự kiện không hỗ trợ'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const list = await DB.GamePrivateEvent
    .find({ type: type, game: game._id, display: true })
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .sort({ need: 1 })

    const format = JSON.parse(JSON.stringify(list))

    for (let i = 0; i < format.length; i++) {
      format[i].status = await getGamePrivateEventActive(event, format[i], type)
    }

    return resp(event, { result: { list: format } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})