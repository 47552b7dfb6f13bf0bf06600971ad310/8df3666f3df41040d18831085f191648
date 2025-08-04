import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    
    const match : any = {}
    match['$or'] =  [
      { parent: { $exists: false } },
      { parent: null }
    ]

    const list = await DB.CollabLevel.find(match).select('number')
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})