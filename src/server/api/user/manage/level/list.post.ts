import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('user.level.list', auth.type)

    const match : any = { $or: [
      { collab: { $exists: false } },
      { collab: null }
    ]}

    const list = await DB.UserLevel
    .find(match)
    .populate({ path: 'voucher.friend', select: 'title value type'})
    .sort({ number: 1 })

    const total = await DB.UserLevel.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})