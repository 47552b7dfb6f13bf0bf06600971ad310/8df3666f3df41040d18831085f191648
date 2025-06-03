import type { IAuth, IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { game : gameID, title } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!title) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GameTool.findOne({ _id: gameID }).select('manager') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    body.game = game._id
    await DB.GameToolNews.create(body)

    logGameAdmin(event, 'tool', game._id, `Thêm tin tức <b>${title}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})