import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('user.list', auth.type)

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!search.key){
      if(search.by == 'USER') match['username'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'MAIL') match['email'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'PHONE') match['phone'] = { $regex : search.key, $options : 'i' }
    }

    const list = await DB.User
    .find(match)
    .select('username email phone currency statistic block type createdAt')
    .sort(sorting)
    .skip((current - 1) * size) 
    .limit(size)

    const total = await DB.User.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})