import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('collab.level.list', auth.type)

    const match : any = {}
    match['$or'] =  [
      { parent: { $exists: false } },
      { parent: null }
    ]

    const list = await DB.CollabLevel
    .find(match)
    .sort({ number: 1 })

    const total = await DB.CollabLevel.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})