import { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const code = runtimeConfig.public.collab
    const match : any = { collab: null, display: true }

    if(!!code){
      const collab = await DB.Collab.findOne({ code: code }).select(`privilege gatepay`) as IDBCollab
      if(!!collab && !!collab.privilege.edit_gate){
        if(!!collab.privilege.edit_gate && collab.gatepay > 0) match['collab'] = collab._id
      }
    }

    const gates = await DB.Gate.find(match).select('-key -qrcode -display -createdAt -updatedAt')
    return resp(event, { result: gates })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})