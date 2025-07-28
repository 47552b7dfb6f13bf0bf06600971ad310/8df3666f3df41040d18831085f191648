import jwt from 'jsonwebtoken'
import type { IAuth, IDBGamePrivate, IDBGamePrivateUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)

    const { game : code, token } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!token) throw 'Không tìm thấy mã ủy quyền'

    const game = await DB.GamePrivate.findOne({ code: code, display: true }).select('secret key') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'

    const userGame = await DB.GamePrivateUser.findOne({ user: auth._id, game: game._id }).select('played') as IDBGamePrivateUser
    if(!userGame) throw 'Bạn chưa đăng ký chơi'

    const decoded = jwt.verify(token, game.secret) as any
    const url = decoded.url
    const key = game.key

    userGame.played = new Date()
    await userGame.save()

    return resp(event, { result: { url, key, code } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})