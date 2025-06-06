import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, type } = await readBody(event)
    if(!type) throw 'Không tìm thấy loại trang bị'
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    
    const user = await DB.User.findOne({ _id: auth._id }).select(`character.${type}.bag`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    // @ts-expect-error
    const bag = user.character ? user.character[type] ? user.character[type]['bag'] || [] : [] : []
    const match : any = { _id: { $in: bag }}
    if(!!search) match['name'] = { key : { $regex : search, $options : 'i' }}
    
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