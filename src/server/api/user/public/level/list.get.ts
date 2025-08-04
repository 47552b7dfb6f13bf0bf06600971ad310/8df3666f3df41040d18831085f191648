import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const collabCode = runtimeConfig.public.collab
    const match : any = {}

    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('privilege') as IDBCollab
      if(!!collab && !!collab.privilege.edit_level) match['collab'] = collab._id
      else match['$or'] =  [{ collab: { $exists: false } }, { collab: null }]
    }
    else match['$or'] =  [{ collab: { $exists: false } }, { collab: null }]

    const list = await DB.UserLevel
    .find(match)
    .sort({ number: 1 })
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})