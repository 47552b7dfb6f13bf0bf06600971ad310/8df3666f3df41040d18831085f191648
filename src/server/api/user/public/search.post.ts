import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { key, type, collab } = await readBody(event)

    const match : any = { username : { $regex : key.toLowerCase(), $options : 'i' }}
    if(!!type) match['type'] = type
    if(!!collab){
      const collabData = await DB.Collab.findOne({ code: collab }).select('_id') as IDBCollab
      if(!collabData) throw 'Mã cộng tác viên không tồn tại'
      match['reg.collab'] = collabData._id
    }

    const users = await DB.User.find(match).select('username').limit(10)
    return resp(event, { result: users })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})