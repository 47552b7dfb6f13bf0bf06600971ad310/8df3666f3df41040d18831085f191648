import type { IAuth, IDBCollab, IDBCollabLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { code, user, level, link, parent } = body
    if(!code || !user || !level || !link) throw 'Dữ liệu đầu vào sai'

    if(!parent){
      await checkPermission('collab.add', auth.type)

      const userCheck = await DB.User.findOne({ _id: user }).select('_id') as IDBUser
      if(!userCheck) throw 'Không tìm thấy người dùng'

      const levelCheck = await DB.CollabLevel.findOne({ _id: level }).select('_id') as IDBCollabLevel
      if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'
      
      const checkDup = await DB.Collab.findOne({ code: code }).select('_id') as IDBCollab
      if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'

      delete body['parent']
      await DB.Collab.create(body)
      await logAdmin(event, `Thêm cộng tác viên với mã <b>${code}</b>`)
    }
    else {
      const collab = await DB.Collab.findOne({ code: parent }).select('user') as IDBCollab
      if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
      if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
      
      const userCheck = await DB.User.findOne({ _id: user, 'reg.collab': collab._id }).select('_id') as IDBUser
      if(!userCheck) throw 'Tài khoản người dùng không thuộc trang cộng tác viên'

      const levelCheck = await DB.CollabLevel.findOne({ _id: level, parent: collab._id }).select('_id') as IDBCollabLevel
      if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'

      const checkDup = await DB.Collab.findOne({ code: code }).select('_id') as IDBCollab
      if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'

      body['parent'] = collab._id
      await DB.Collab.create(body)
    }

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})