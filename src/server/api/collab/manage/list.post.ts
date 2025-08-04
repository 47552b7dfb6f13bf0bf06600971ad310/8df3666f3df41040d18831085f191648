import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.list', auth.type)

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!search){
      match['code'] = { $regex : search, $options : 'i' }
    }

    const list = await DB.Collab
    .find(match)
    .populate({ path: 'level', select: 'number' })
    .populate({ path: 'user', select: 'username' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.Collab.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})