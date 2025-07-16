import type { IAuth, IDBGamePrivate, IDBGamePrivateRank } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { server, type, end, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!server || !type || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)
    
    const getByServer = await DB.GamePrivateRank.findOne({ game: game._id, server: server, type: type }).select('_id') as IDBGamePrivateRank
    if(!!getByServer) throw 'Tiến trình cho máy chủ này đã tồn tại'

    await DB.GamePrivateRank.create({
      ...body,
      game: game._id,
      end: formatDate(end).dayjs.hour(23).minute(0).second(0).millisecond(0)['$d'],
    })

    logGameAdmin(event, 'private', game._id, `Tạo tiến trình đua <b>TOP ${type == 'power' ? 'lực chiến' : 'cấp độ'}</b> cho máy chủ <b>${server}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})