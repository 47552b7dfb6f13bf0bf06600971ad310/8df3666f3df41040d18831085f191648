import type { IAuth, IDBCollab, IDBGate, IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { collab : code, code : payCode } = body
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
    if(!payCode) throw 'Không tìm thấy mã giao dịch'

    const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác'

    const payment = await DB.Payment.findOne({ code: payCode }).select('gate') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'

    const gate = await DB.Gate.findOne({ _id: payment.gate }).select('collab') as IDBGate
    if(!gate) throw 'Kênh nạp không khả dụng'
    if(auth.type < 100 && !gate.collab) throw 'Không thể thao tác với giao dịch này'
    if(auth.type < 100 && gate.collab.toString() != collab._id.toString()) throw 'Không thể thao tác với giao dịch này'

    await verifyPayment(event, body, auth._id)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})