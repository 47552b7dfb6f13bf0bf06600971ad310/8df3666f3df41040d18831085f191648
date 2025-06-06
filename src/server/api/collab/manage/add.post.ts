import type { IAuth, IDBCollabLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.add', auth.type)

    const body = await readBody(event)
    const { code, user, level, link } = body
    if(!code || !user || !level || !link) throw 'Dữ liệu đầu vào sai'

    const userCheck = await DB.User.findOne({ _id: user }).select('_id') as IDBUser
    if(!userCheck) throw 'Không tìm thấy người dùng'

    const levelCheck = await DB.CollabLevel.findOne({ _id: level }).select('_id') as IDBCollabLevel
    if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'
    
    const checkDup = await DB.Collab.findOne({ code: code }).select('_id')
    if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'

    await DB.Collab.create(body)
    
    await logAdmin(event, `Thêm cộng tác viên với mã <b>${code}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})