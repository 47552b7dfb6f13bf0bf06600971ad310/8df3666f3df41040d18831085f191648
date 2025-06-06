import type { IAuth, IDBEquip } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('equip.edit', auth.type)

    const body = await readBody(event)
    const { _id, name, type, res, power, price } = body
    if(!_id || !name || !type || !res) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(power) || power < 0) throw 'Lực chiến không hợp lệ'
    if(!isNumber(price) || price < 0) throw 'Giá mua không hợp lệ'

    const equip = await DB.Equip.findOne({ _id: _id }).select('name') as IDBEquip
    if(!equip) throw 'Trang bị không tồn tại'

    body.offset.idle.scale = body.offset.idle.scale ? body.offset.idle.scale['$numberDecimal'] || 1 : 1
    body.offset.info.scale = body.offset.info.scale ? body.offset.info.scale['$numberDecimal'] || 1 : 1
    body.offset.attack.scale = body.offset.attack.scale ? body.offset.attack.scale['$numberDecimal'] || 1 : 1
    delete body['_id']
    await DB.Equip.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin trang bị nhân vật <b>${equip.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})