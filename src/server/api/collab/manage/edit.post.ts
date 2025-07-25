import type { IAuth, IDBCollab, IDBCollabLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { _id, code, level, link, parent } = body

    if(!parent){
      if(!_id || !code || !level || !link) throw 'Dữ liệu đầu vào không hợp lệ'
      await checkPermission('collab.edit', auth.type)

      const collab = await DB.Collab.findOne({ _id: _id }).select('code level') as IDBCollab
      if(!collab) throw 'Mã cộng tác viên không tồn tại'

      if(collab.code != code){
        const checkDup = await DB.Collab.findOne({ code: code }).select('_id') as IDBCollab
        if(!!checkDup) throw 'Mã cộng tác viên đã tồn tại'
      }
      
      if(!!collab.level && collab.level.toString() != level.toString()){
        const levelCheck = await DB.CollabLevel.findOne({ _id: level }).select('_id') as IDBCollabLevel
        if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'
      }

      delete body['_id']
      delete body['parent']
      await DB.Collab.updateOne({ _id: collab._id }, body)
      await logAdmin(event, `Sửa mã cộng tác viên <b>${collab.code}</b>`)
    }
    else {
      if(!_id || !level) throw 'Dữ liệu đầu vào không hợp lệ'

      const collabParent = await DB.Collab.findOne({ code: parent }).select('user') as IDBCollab
      if(!collabParent) throw 'Dữ liệu cộng tác viên cha không tồn tại'
      if(auth.type < 100 && collabParent.user.toString() != auth._id.toString()) throw 'Bạn không có quyền thao tác'
      
      const collab = await DB.Collab.findOne({ _id: _id, parent: collabParent._id }).select('level') as IDBCollab
      if(!collab) throw 'Mã cộng tác viên không tồn tại'

      if(!!collab.level && collab.level.toString() != level.toString()){
        const levelCheck = await DB.CollabLevel.findOne({ _id: level, parent: collabParent._id }).select('_id') as IDBCollabLevel
        if(!levelCheck) throw 'Không tìm thấy thông tin cấp độ'
      }
      
      delete body['_id']
      delete body['parent']
      await DB.Collab.updateOne({ _id: collab._id }, body)
    }

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})