import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { size, current, sort, search, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const match : any = { game: game._id, display: true }
    if(search) match['$text'] = { '$search': search }

    const list = await DB.GamePrivateShopPack
    .find(match)
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.GamePrivateShopPack.count(match)

    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})