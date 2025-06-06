import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('forum.list', auth.type)

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.ForumPost
    .find({})
    .populate({ path: 'category', select: 'name key' })
    .populate({ path: 'sub', select: 'name key' })
    .populate({ 
      path: 'creater', 
      select: profileSelect(['currency']).user,
      populate: profileSelect().populate,
    })
    .select('-content')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.ForumPost.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})