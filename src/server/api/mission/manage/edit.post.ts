import type { IAuth, IDBMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('voucher.edit', auth.type)

    const body = await readBody(event)
    const { _id, need, name, ecoin } = body
    if(!_id || !need || !name) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(ecoin) || ecoin < 1) throw 'Phần thưởng ECoin phải lớn hơn 0'

    const mission = await DB.Mission.findOne({ _id: _id }).select('name') as IDBMission
    if(!mission) throw 'Nhiệm vụ này không tồn tại'

    delete body['_id']
    await DB.Mission.updateOne({ _id: _id }, body)

    logAdmin(event, `Sửa thông tin nhiệm vụ <b>${mission.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})