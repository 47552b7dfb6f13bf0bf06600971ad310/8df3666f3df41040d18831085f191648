import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('config.article.edit', auth.type)

    const data = await readBody(event)
    const { type, content } = data
    if(!type) throw 'Không tìm thấy kiểu bài viết'

    // Update
    await DB.Config.updateMany({}, { [`article.${type}`]: content })
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})