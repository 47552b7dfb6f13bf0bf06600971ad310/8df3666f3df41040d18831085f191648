import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { type } = await readBody(event)
    if(!type) throw 'Không tìm thấy loại cửa hàng'

    const user = await DB.User.findOne({ _id: auth._id }).select(`character.sex character.${type}`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // @ts-expect-error
    const bag = user.character ? user.character[type] ? user.character[type]['bag'] || [] : [] : []
    const sex = user.character.sex

    const match : any = { 
      _id: { $nin: bag },
      default: false, 
      type: type
    }
    if(type == 'body') match['sex'] = sex

    const list = await DB.Equip.find(match)
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})