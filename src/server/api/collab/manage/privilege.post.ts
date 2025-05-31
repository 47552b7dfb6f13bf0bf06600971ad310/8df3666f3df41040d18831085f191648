import type { IAuth, IDBCollab, IDBCollabLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { _id, edit_info, edit_gate } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const collab = await DB.Collab.findOne({ _id: _id }).select('privilege code') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'

    collab.privilege.edit_info = edit_info
    collab.privilege.edit_gate = edit_gate

    // @ts-expect-error
    await collab.save()
    
    await logAdmin(event, `Sửa quyền hạn cộng tác viên mã <b>${collab.code}</b>`)
    return resp(event, { message: 'Lưu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})