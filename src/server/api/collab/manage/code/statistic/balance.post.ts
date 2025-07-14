import type { IAuth, IDBCollab } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { collab : code } = await readBody(event)
    if(!code) throw 'Dữ liệu đầu vào không đủ'

    const collab = await DB.Collab.findOne({ code: code }).select('code user money gatepay') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    // Result
    return resp(event, {
      result: {
        money: collab.money,
        gatepay: collab.gatepay
      }
    })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})