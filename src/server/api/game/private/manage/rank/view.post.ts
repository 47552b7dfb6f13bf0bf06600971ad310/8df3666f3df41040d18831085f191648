import type { IAuth, IDBGamePrivate, IDBGamePrivateRank } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { fetchID, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!fetchID) throw 'Không tìm thấy ID tiến trình'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('ip api secret manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'
    await getAuthGM(event, auth, game)

    const processEvent = await DB.GamePrivateRank.findOne({ _id: fetchID, game: game._id }).select('server type') as IDBGamePrivateRank
    if(!processEvent) throw 'Tiến trình không tồn tại'

    let list : any = []
    if(processEvent.type == 'power') list = await gameGetRankPower(event, {
      url: game.api.power,
      secret: game.secret,
      server_id: processEvent.server
    })
    else list = await gameGetRankLevel(event, {
      url: game.api.level,
      secret: game.secret,
      server_id: processEvent.server
    })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})