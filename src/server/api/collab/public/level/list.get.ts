import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const collabCode = runtimeConfig.public.collab
    const match : any = {}

    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(collab) match['parent'] = collab._id
    }
    else {
      match['$or'] =  [
        { parent: { $exists: false } },
        { parent: null }
      ]
    }

    // match['$or'] =  [
    //   { parent: { $exists: false } },
    //   { parent: null }
    // ]

    const list = await DB.CollabLevel
    .find(match)
    .sort({ number: 1 })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})