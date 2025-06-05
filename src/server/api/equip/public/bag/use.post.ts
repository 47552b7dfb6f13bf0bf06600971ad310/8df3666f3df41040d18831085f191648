import type { IAuth, IDBEquip, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID trang bị'

    const equip = await DB.Equip.findOne({ _id: _id }) as IDBEquip
    if(!equip) throw 'Trang bị không tồn tại'

    const user = await DB.User.findOne({ _id: auth._id }).select(`character.${equip.type}`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // @ts-expect-error
    const bag = user.character ? user.character[equip.type] ? user.character[equip.type]['bag'] || [] : [] : []
    if(!bag.includes(equip._id)) throw 'Bạn chưa có trang bị này trong kho đồ'
    
    await DB.User.updateOne({ _id: user._id }, { 
      [`character.${equip.type}.use`] : equip._id 
    })

    return resp(event, { message: 'Trang bị thành công', result: equip })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})