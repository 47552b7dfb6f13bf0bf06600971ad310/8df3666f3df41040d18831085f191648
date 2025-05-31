import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, search, user } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const userCheck = (!!user && auth.type == 100) ? user : auth._id

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { from: userCheck }
    if(!!search) {
      const users = await DB.User.find({
        username : { $regex : search.toLowerCase(), $options : 'i' }
      }).select('_id')
      match['user'] = { $in: users.map(i => i._id) }
    }

    const list = await DB.Invite
    .find(match)
    .populate({ 
      path: 'user', 
      select: profileSelect().user, 
      populate: profileSelect().populate
    })
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)
    
    const total = await DB.Invite.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})