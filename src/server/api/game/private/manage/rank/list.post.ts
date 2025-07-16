import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, type, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!type) throw 'Dữ liệu kiểu xếp hạng sai'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    const match : any = { type: type, game: game._id }

    const list = await DB.GamePrivateRank
    .find(match)
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'})
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.GamePrivateRank.count(match)
    return resp(event, { result: { list: list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})