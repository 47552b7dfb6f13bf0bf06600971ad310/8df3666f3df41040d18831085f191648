export default defineEventHandler(async (event) => {
  try {
    const device = getCookie(event, 'visitor-id')
    const block = await DB.BlockDevice.findOne({ device: device }).select('_id')
    if(!!block) throw 'Bạn bị chặn quyền truy cập'
  }
  catch (e:any) {
    return resp(event, { code: 511, message: e.toString() })
  }
})