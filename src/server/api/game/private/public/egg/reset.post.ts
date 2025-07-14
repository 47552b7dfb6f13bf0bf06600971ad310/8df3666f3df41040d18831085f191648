import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { game : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('_id') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GamePrivateUser.findOne({ game: game._id, user: auth._id }).select('egg') as IDBGamePrivateUser
    if(!userGame) throw 'Vui lòng chơi game trước khi thao tác'

    userGame.egg = { one: [], two: [], three: [], four: [], five: [], six: [] }
    await userGame.save()

    return resp(event, { message: 'Đặt lại thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})