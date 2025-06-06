import type { IAuth, IDBGameCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('game.category.add', auth.type)

    const body = await readBody(event)
    const { name, icon } = body
    if(!name || !icon) throw 'Dữ liệu đầu vào không hợp lệ'

    const key = formatVNString(name, '-')
    const getByKey = await DB.GameCategory.findOne({ key: key }).select('_id') as IDBGameCategory
    if(!!getByKey) throw 'Tên thể loại đã tồn tại'

    body.key = key
    await DB.GameCategory.create(body)
    logAdmin(event, `Thêm thể loại trò chơi <b>${name}</b>`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})