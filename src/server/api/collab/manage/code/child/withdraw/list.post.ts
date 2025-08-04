import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, parent } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const collab = await DB.Collab.findOne({ code: parent }).select('user') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    match['parent'] = collab._id

    if(!!search.key){
      if(search.by == 'CODE'){
        match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      }
      if(search.by == 'USER'){
        const users = await DB.User.find({
          username : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')
        
        match['user'] = { $in: users.map(i => i._id) }
      }
      if(search.by == 'COLLAB'){
        const collabs = await DB.Collab.find({
          code : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')
        
        match['collab'] = { $in: collabs.map(i => i._id)}
      }
    }

    const list = await DB.CollabWithdraw
    .find(match)
    .populate({ path: 'user', select: 'username' })
    .populate({ path: 'verify.person', select: 'username' })
    .populate({ path: 'collab', select: 'code' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.CollabWithdraw.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})