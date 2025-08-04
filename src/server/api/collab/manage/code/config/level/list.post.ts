import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { collab : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã cộng tác viên'

    const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const match : any = { collab: collab._id }

    const list = await DB.UserLevel
    .find(match)
    .populate({ path: 'voucher.friend', select: 'title value type'})
    .sort({ number: 1 })

    const total = await DB.UserLevel.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})