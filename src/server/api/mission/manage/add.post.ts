import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('mission.add', auth.type)

    const body = await readBody(event)
    const { type, name, need, ecoin } = body
    if(!type || !name || !need) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(ecoin) || ecoin < 1) throw 'Phần thưởng ECoin phải lớn hơn 0'

    await DB.Mission.create(body)

    logAdmin(event, `Thêm nhiệm vụ <b>${name}</b> với giá trị phần thưởng <b>${ecoin}</b> ECoin`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})