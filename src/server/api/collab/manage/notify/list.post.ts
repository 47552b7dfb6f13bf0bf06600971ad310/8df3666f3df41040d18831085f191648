import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.notify.list', auth.type)

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { $or: [
      { collab: { $exists: false } },
      { collab: null }
    ]}

    const list = await DB.CollabNotify
    .find(match)
    .populate({ path: 'collab', select: 'code link' })
    .select('-content')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.CollabNotify.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})