import type { IAuth, IDBGamePrivate, IDBGamePrivateRank } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, fetchID, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const processEvent = await DB.GamePrivateRank.findOne({ _id: fetchID, game: game._id }).select('server type') as IDBGamePrivateRank
    if(!processEvent) throw 'Tiến trình không tồn tại'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { process: processEvent._id, game: game._id }

    const list = await DB.GamePrivateRankLog
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateRankLog.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})