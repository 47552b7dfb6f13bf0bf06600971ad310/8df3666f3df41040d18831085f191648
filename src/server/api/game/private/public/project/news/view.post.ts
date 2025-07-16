import type { IDBGamePrivateNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { _id } = body
    if(!_id) throw 'Không tìm thấy ID tin tức'

    const news = await DB.GamePrivateNews.findOne({ _id: _id }) as IDBGamePrivateNews
    if(!news) throw 'Tin tức không tồn tại'

    return resp(event, { result: news })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})