import type { IAuth, IDBGameToolUser, IDBGameTool, IDBGameToolServerOpen } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { game : code, server_id } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!server_id) throw 'Vui lòng chọn máy chủ'

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    let result = { recharge: false, mail: false }
    const userGame = await DB.GameToolUser.findOne({ game: game._id, user: auth._id, server_id: server_id }) as IDBGameToolUser
    
    if(!!userGame){
      result.mail = userGame.mail
      result.recharge = userGame.recharge
    }
    
    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})