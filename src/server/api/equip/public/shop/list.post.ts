import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, type } = await readBody(event)
    if(!type) throw 'Không tìm thấy loại trang bị'
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const user = await DB.User.findOne({ _id: auth._id }).select(`character.sex character.${type}`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    // @ts-expect-error
    const bag = user.character ? user.character[type] ? user.character[type]['bag'] || [] : [] : []
    const sex = user.character.sex
    const match : any = { 
      _id: { $nin: bag },
      default: false, 
      type: type
    }
    if((type == 'body' || type == 'weapon') && auth.type < 100) match['sex'] = sex
    if(!!search) match['name'] = { $regex : search, $options : 'i' }

    const list = await DB.Equip
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.Equip.count(match)

    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})