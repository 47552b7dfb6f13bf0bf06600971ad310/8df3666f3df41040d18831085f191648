import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.del', auth.type)

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ _id: _id }).select('code') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    await DB.CollabNotify.deleteMany({ collab: collab._id })
    await DB.CollabIncome.deleteMany({ collab: collab._id })
    await DB.CollabWithdraw.deleteMany({ collab: collab._id })
    await DB.User.updateMany({ 'reg.collab': collab._id }, { 'reg.collab': null })
    await DB.Collab.deleteOne({ _id: _id })

    await logAdmin(event, `Xóa mã cộng tác viên <b>${collab.code}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})