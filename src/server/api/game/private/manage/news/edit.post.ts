import type { IAuth, IDBGamePrivate, IDBGamePrivateNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    
    const body = await readBody(event)
    const { _id, game : gameID, title } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !title) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const news = await DB.GamePrivateNews.findOne({ game: game._id, _id: _id }).select('title') as IDBGamePrivateNews
    if(!news) throw 'Tin tức không tồn tại'

    delete body['_id']
    delete body['game']
    await DB.GamePrivateNews.updateOne({ _id: news._id }, body)

    logGameAdmin(event, 'private', game._id, `Sửa tin tức <b>${news.title}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})