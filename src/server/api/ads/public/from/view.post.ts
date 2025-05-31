import { IDBAdsFrom } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { code } = await readBody(event)
    if(!code) throw true

    const data = await DB.AdsFrom.findOne({ code: code }).select('_id') as IDBAdsFrom
    if(!data) throw true
    
    await DB.AdsFrom.updateOne({ _id: data._id }, { $inc: { 'view': 1 }})
    return resp(event, { result: true })
  } 
  catch (e:any) {
    const runtimeConfig = useRuntimeConfig()
    deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    return resp(event, { result: false })
  }
})