import type { H3Event } from 'h3'
import type { IAuth, IDBGameChina, IDBGamePrivate, IDBGameTool } from "~~/types"

export default async (event : H3Event, auth : IAuth, game : IDBGameChina | IDBGamePrivate | IDBGameTool) : Promise<any> => {
  try {
    if(auth.type == 0) throw 'Không có quyền truy cập'
    if(auth.type == 100) return true
    if(auth.type == 3) return true

    const manager = game.manager
    if(!manager.includes(auth._id)) throw 'Không có quyền truy cập'
    return true
  }
  catch (e:any) {
    event.node.res.end(JSON.stringify({code: 403, message: e.toString()}))
  }
}