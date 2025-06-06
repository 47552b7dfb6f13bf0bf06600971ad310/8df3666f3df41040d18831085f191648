import type { IAuth, IDBGamePrivate, IDBGamePrivateServerOpen } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, game : gameID, server_name, opentime } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !server_name || !opentime) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const openserver = await DB.GamePrivateServerOpen.findOne({ game: game._id, _id: _id }).select('server_name') as IDBGamePrivateServerOpen
    if(!openserver) throw 'Lịch mở không tồn tại'

    delete body['_id']
    delete body['game']
    await DB.GamePrivateServerOpen.updateOne({ _id: openserver._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa lịch mở máy chủ <b>${openserver.server_name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})