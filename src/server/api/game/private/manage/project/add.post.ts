import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('game.private.add', auth.type)

    const body = await readBody(event)
    const { platform, category, name, code, description } = body
    if(!platform || !category || !name || !code || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id')
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id')
    if(!categoryCheck) throw 'Thể loại không tồn tại'

    const key = formatVNString(name, '-')
    const nameCheck = await DB.GamePrivate.findOne({ key: key }).select('_id')
    if(!!nameCheck) throw 'Tên trò chơi đã tồn tại'

    const codeCheck = await DB.GamePrivate.findOne({ code: code }).select('_id')
    if(!!codeCheck) throw 'Mã trò chơi đã tồn tại'

    body.key = key
    await DB.GamePrivate.create(body)

    logAdmin(event, `Thêm trò chơi Private <b>${name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})