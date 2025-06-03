import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('user.level.list', auth.type)

    const list = await DB.UserLevel
    .find({})
    .populate({ path: 'voucher.friend', select: 'title value'})
    .sort({ number: 1 })

    const total = await DB.UserLevel.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})