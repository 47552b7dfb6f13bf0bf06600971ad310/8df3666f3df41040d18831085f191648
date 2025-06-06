import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('config.get', auth.type)
    
    const config = await DB.Config.findOne().select('-article')
    if(!config) throw 'Không tìm thấy cấu hình trang'
    
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})