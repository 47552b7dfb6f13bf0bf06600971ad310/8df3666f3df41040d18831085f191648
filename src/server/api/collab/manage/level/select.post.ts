import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { parent } = await readBody(event)

    const match : any = {}
    if(!!parent){
      const collab = await DB.Collab.findOne({ code: parent }).select('user') as IDBCollab
      if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
      if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
      
      match['parent'] = collab._id
    }

    const list = await DB.CollabLevel.find(match).select('number')
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})