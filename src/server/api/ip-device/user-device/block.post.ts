import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)
    const { device, action } = body
    if(!device || !action) throw 'Dữ liệu đầu vào không hợp lệ'

    if(action == 'block'){
      const lock = await DB.BlockDevice.findOne({ device: device }).select('_id')
      if(!!lock) throw 'Thiết bị đã có trong danh sách khóa'

      await DB.BlockDevice.create({ device: device })
      logAdmin(event, `Khóa thiết bị <b>${device}</b>`)

      return resp(event, { message: 'Khóa thiết bị thành công' })
    }

    else if(action == 'unblock'){
      const lock = await DB.BlockDevice.findOne({ device: device }).select('_id')
      if(!lock) throw 'Thiết bị không có trong danh sách khóa'

      await DB.BlockDevice.deleteMany({ device: device })
      logAdmin(event, `Mở khóa thiết bị <b>${device}</b>`)

      return resp(event, { message: 'Mở khóa thiết bị thành công' })
    }

    else throw 'Hành động không hỗ trợ'
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})