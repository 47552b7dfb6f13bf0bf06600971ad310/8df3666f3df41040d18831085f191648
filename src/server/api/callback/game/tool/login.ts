import md5 from 'md5'
import { IDBGameTool, IDBGameToolUser, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { username, password, code : gameCode } = await readBody(event)
    if(!username || !password || !gameCode) throw 'Vui lòng nhập đầy đủ thông tin'

    // Get Game
    const game = await DB.GameTool.findOne({ code: gameCode }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('username password block') as IDBUser
    
    // Check User
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(!!user.block) throw 'Tài khoản của bạn đang bị khóa'

    return resp(event, { result: user.username, message: 'Đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})