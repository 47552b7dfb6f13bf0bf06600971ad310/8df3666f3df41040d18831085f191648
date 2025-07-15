import type { IAuth, IDBEquip, IDBUser } from "~~/types"

const textFormat = {
  body: 'Trang Phục',
  wing: 'Cánh',
  weapon: 'Vũ Khí',
  pet: 'Thú Cưng',
  circle: 'Pháp Trận',
  title: 'Danh Hiệu',
}

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID trang bị'

    const equip = await DB.Equip.findOne({ _id: _id }).select('name type display price') as IDBEquip
    if(!equip) throw 'Trang bị không tồn tại'
    if(!equip.display) throw 'Trang bị chưa được mở bán'

    const user = await DB.User.findOne({ _id: auth._id }).select(`character.${equip.type} currency`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // @ts-expect-error
    const bag = user.character ? user.character[equip.type] ? user.character[equip.type]['bag'] || [] : [] : []
    if(bag.includes(equip._id)) throw 'Bạn đã có trang bị này trong kho đồ'
    
    let price = equip.price
    if(!runtimeConfig.public.dev && auth.type == 100) price = 0 // Admin Free
    
    // Check Currency
    const minus = getCoinMinus(user.currency, price)

    await DB.User.updateOne({ _id: user._id }, { 
      $inc: { 
        'currency.coin': minus.coin * -1,
        'currency.lcoin': minus.lcoin * -1,
      },
      $push: { [`character.${equip.type}.bag`] : equip._id }
    })

    logUser({
      user: user._id,
      // @ts-expect-error
      action: `Dùng <b>${price.toLocaleString('vi-VN')} Xu</b> mua trang bị [${textFormat[equip.type]}] ${equip.name}</b>`,
      type: `character.equip.${equip.type}.buy`,
    })

    IO.to(user._id.toString()).emit('auth-update')

    return resp(event, { message: 'Mua thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})