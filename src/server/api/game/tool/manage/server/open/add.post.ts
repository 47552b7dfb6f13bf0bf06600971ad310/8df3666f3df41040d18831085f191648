import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { game : gameID, server_name, opentime } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!server_name || !opentime) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    body.game = game._id
    await DB.GameToolServerOpen.create(body)

    logGameAdmin(event, 'tool', game._id, `Thêm lịch mở máy chủ <b>${server_name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})