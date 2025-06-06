export default defineEventHandler(async (event) => {
  try {
    const IP = getRequestIP(event, { xForwardedFor: true })
    const block = await DB.BlockIP.findOne({ ip: IP }).select('_id')
    if(!!block) throw 'Bạn bị chặn quyền truy cập'
  }
  catch (e:any) {
    return resp(event, { code: 511, message: e.toString() })
  }
})