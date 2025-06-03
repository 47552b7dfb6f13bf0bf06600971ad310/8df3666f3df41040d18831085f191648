import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('config.edit', auth.type)

    const data = await readBody(event)
    
    const { change } = data
    if(!change) throw 'Dữ liệu đầu vào không hợp lệ'
    
    if(change == 'basic') logAdmin(event, 'Cập nhật thông tin <b>cơ bản</b> trang web')
    if(change == 'contact') logAdmin(event, 'Cập nhật thông tin <b>liên hệ</b> trang web')
    if(change == 'social') logAdmin(event, 'Cập nhật thông tin <b>mạng xã hội</b> trang web')
    if(change == 'download') logAdmin(event, 'Cập nhật thông tin <b>link tải</b> ứng dụng')
    if(change == 'facebook') logAdmin(event, 'Cập nhật cấu hình <b>API Facebook</b>')
    if(change == 'google') logAdmin(event, 'Cập nhật cấu hình <b>API Google</b>')
    if(change == 'zalo') logAdmin(event, 'Cập nhật cấu hình <b>API Zalo</b>')
    if(change == 'tiktok') logAdmin(event, 'Cập nhật cấu hình <b>API Tiktok</b>')
    if(change == 'vip') logAdmin(event, 'Cập nhật cấu hình <b>Giá VIP</b>')
    if(change == 'yuan') logAdmin(event, 'Cập nhật cấu hình <b>Giá Tệ</b>')
    if(change == 'promo') logAdmin(event, 'Cập nhật cấu hình <b>Khuyễn mãi</b>')
    if(change == 'guild') logAdmin(event, 'Cập nhật cấu hình <b>Gia Tộc</b>')
    if(change == 'security') logAdmin(event, 'Cập nhật cấu hình <b>Bảo Mật Hệ Thống</b>')

    // Update
    delete data['_id']
    delete data['change']
    await DB.Config.updateMany({}, data)

    IO.emit('web-update')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})