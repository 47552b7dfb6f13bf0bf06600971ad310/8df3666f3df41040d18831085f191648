import type { IDBGameTool } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { size, current, sort, game : code } = body
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const game = await DB.GameTool.findOne({ code: code, display: true }).select('_id') as IDBGameTool
    if(!game) throw 'Trò chơi không tồn tại'

    const match : any = { game: game._id }
    const list = await DB.GameToolNews
    .find(match)
    .select('-content')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GameToolNews.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})