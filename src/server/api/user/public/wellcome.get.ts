import type { IAuth, IDBConfig, IDBUser } from "~~/types"
export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const config = await DB.Config.findOne({}).select('promo') as IDBConfig
    if(!config) throw true

    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('vouchers')
    .populate({ path: 'vouchers', select: 'type title value '}) as IDBUser
    if(!user) throw true

    const result : any = JSON.parse(JSON.stringify(config.promo))
    result.vouchers = user.vouchers

    return resp(event, { result: result })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})