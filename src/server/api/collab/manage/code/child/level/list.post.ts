import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { parent } = await readBody(event)
    if(!parent) throw 'Dữ liệu đầu vào sai'

    const collab = await DB.Collab.findOne({ code: parent }).select('user') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const match : any = {}
    match['parent'] = collab._id

    const list = await DB.CollabLevel.find(match).sort({ number: 1 })
    const total = await DB.CollabLevel.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})