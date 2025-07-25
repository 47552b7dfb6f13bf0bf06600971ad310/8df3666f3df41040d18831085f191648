import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('payment.coin.list', auth.type)

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {
      '$or' : [
        { collab: { $exists: false } },
        { collab: null }
      ]
    }

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