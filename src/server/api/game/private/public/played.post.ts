import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, user, collab : code } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    let userCheck
    if(!code) userCheck = (!!user && auth.type == 100) ? user : auth._id
    else {
      const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
      if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
      if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
      userCheck = !!user ? user : auth._id
    }

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: userCheck }
    if(!!search){
      const key = formatVNString(search, '-')
      const games = await DB.GamePrivate.find({ $or: [
        { key : { $regex : key, $options : 'i' }},
        { code : { $regex : key, $options : 'i' }},
      ]}).select('_id')
      match['game'] = { $in: games.map(i => i._id) }
    }

    const list = await DB.GamePrivateUser
    .find(match)
    .populate({ path: 'game', select: 'name code key' })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GamePrivateUser.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})