import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, collab : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { collab: collab._id }
    if(search.key){
      if(search.by == 'CODE') match['code'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'USER'){
        const users = await DB.User.find({
          username : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')
        
        match['user'] = { $in: users.map(i => i._id)}
      }
    }

    const list = await DB.Payment
    .find(match)
    .populate({ path: 'gate', select: 'name color type' })
    .populate({ path: 'user', select: 'username' })
    .populate({ path: 'verify.person', select: 'username' })
    .select('gate user code money status verify')
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.Payment.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})