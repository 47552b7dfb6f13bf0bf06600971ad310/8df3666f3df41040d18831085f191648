import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { password } = await readBody(event)
    if(!password) throw 'Vui lòng nhập đầy đủ thông tin'

    const config = await DB.Config.findOne().select('security') as IDBConfig
    if(password != config.security.manage.password) throw 'Mã ủy quyền không hợp lệ'
    return resp(event, { message: 'Xác thực quản trị viên thành công', result: '/manage/@eni' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})