import type { IAuth, IDBUser } from "~~/types"

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
    const auth = await getAuth(event) as IAuth
    const { type } = await readBody(event)
    if(!type) throw 'Không tìm thấy loại trang bị nâng cấp'

    const user = await DB.User.findOne({ _id: auth._id }).select(`currency character.${type}.level`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // @ts-expect-error
    const now = !!user.character ? (user.character[type] ? user.character[type].level || 0 : 0) : 0
    const next = now + 1

    // Make Price
    let price = next * 10000
    if(auth.type == 100) price = 0 // Admin Free
    if(user.currency.coin < price) throw 'Số dư không đủ'

    // Make Rate
    let rate = 100 - ((next >= 10 ? 9.5 : next) * 10)
    if(auth.type == 100) rate = 100 // Admin 100%

    // Minus Coin
    price > 0 && await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': price * -1 } })
    IO.to(user._id.toString()).emit('auth-update')

    // Upgrade
    const success = Math.random() < (rate / 100) ? true : false
    if(!!success){
      await DB.User.updateOne({ _id: user._id }, { [`character.${type}.level`]: next })

      logUser({
        user: user._id,
        // @ts-expect-error
        action: `Dùng <b>${price.toLocaleString('vi-VN')} Xu</b> nâng cấp <b>${textFormat[type]}</b> lên <b>+${next}</b> thành công`,
        type: `character.equip.${type}.upgrade.success`,
      })

      return resp(event, { message: 'Nâng cấp thành công' })
    }
    else {
      logUser({
        user: user._id,
        // @ts-expect-error
        action: `Dùng <b>${price.toLocaleString('vi-VN')} Xu</b> nâng cấp <b>${textFormat[type]}</b> lên <b>+${next}</b> thất bại`,
        type: `character.equip.${type}.upgrade.fail`,
      })
      throw 'Thật đáng tiếc, bạn đã nâng cấp thất bại'
    }
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})