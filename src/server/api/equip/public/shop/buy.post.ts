import type { IAuth, IDBEquip, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID trang bị'

    const equip = await DB.Equip.findOne({ _id: _id }) as IDBEquip
    if(!equip) throw 'Trang bị không tồn tại'

    const user = await DB.User.findOne({ _id: auth._id }).select(`character.${equip.type} currency`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // @ts-expect-error
    const bag = user.character ? user.character[equip.type] ? user.character[equip.type]['bag'] || [] : [] : []
    if(bag.includes(equip._id)) throw 'Bạn đã có trang bị này trong kho đồ'
    
    const price = equip.price
    if(user.currency.coin < price) throw 'Số dư xu không đủ'

    await DB.User.updateOne({ _id: user._id }, { 
      $inc: { 'currency.coin': price * -1 },
      $push: { [`character.${equip.type}.bag`] : equip._id }
    })
    logUser({
      user: user._id,
      action: `Dùng <b>${price.toLocaleString('vi-VN')} Xu</b> mua trang bị nhân vật <b>${equip.name}</b>`,
      type: `character.equip.${equip.type}.buy`,
    })

    // Socket Update Auth
    IO.to(user._id.toString()).emit('auth-update')

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})