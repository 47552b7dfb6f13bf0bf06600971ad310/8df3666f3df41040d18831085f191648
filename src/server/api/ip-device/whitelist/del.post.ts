import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('ip.whitelist.action', auth.type)

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const ipCheck = await DB.AdminIP.findOne({ _id: _id })
    if(!ipCheck) throw 'IP đã tồn tại'

    await DB.AdminIP.deleteOne({ _id: _id })
    
    logAdmin(event, `Xóa IP <b>${ipCheck.ip}</b> khỏi White List`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})