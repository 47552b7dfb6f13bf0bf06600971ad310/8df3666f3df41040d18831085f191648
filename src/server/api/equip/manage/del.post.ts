import type { IAuth, IDBEquip } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('equip.del', auth.type)

    const body = await readBody(event)
    const { _id } = body
    if(!_id) throw 'Không tìm thấy ID trang bị'

    const equip = await DB.Equip.findOne({ _id: _id }).select('name type') as IDBEquip
    if(!equip) throw 'Trang bị không tồn tại'

    await DB.User.updateMany({ }, { $pull: { [`character.${equip.type}.bag`]: equip._id } })
    await DB.User.updateMany({ 
      [`character.${equip.type}.use`]: equip._id
    }, { 
      [`character.${equip.type}.use`]: null
    })
    await DB.Equip.deleteOne({ _id: equip._id })

    logAdmin(event, `Xóa trang bị nhân vật <b>${equip.name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})