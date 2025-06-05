import type { IAuth, IDBEquip, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { sex } = await readBody(event)
    if(!isNumber(sex)) throw 'Dữ liệu đầu vào sai'
    if(sex != 1 && sex != 2) throw 'Dữ liệu đầu vào sai'

    const user = await DB.User.findOne({ _id: auth._id }).select('character') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.character.sex > 0) throw 'Bạn đã chọn giới tính nhân vật rồi'

    const equip = await DB.Equip.findOne({ default: true, sex: sex }).select('_id') as IDBEquip
    if(!equip) throw 'Hệ thống chưa sẵn sàng'

    user.character.sex = sex
    user.character.body.bag.push(equip._id)
    user.character.body.use = equip._id
    await user.save()

    logUser({
      user: user._id,
      action: `Thao tác chọn giới tính <b>${sex == 1 ? 'nam' : 'nữ'}</b> cho nhân vật`,
      type: 'change.sex'
    })

    return resp(event, { message: 'Chọn giới tính thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})