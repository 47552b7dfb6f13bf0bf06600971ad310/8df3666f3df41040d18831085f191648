import { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã cộng tác viên'

    const collab = await DB.Collab.findOne({ code: code }).select('user info') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
      
    return resp(event, { result: collab.info })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})