import { IDBCollab, IDBConfig } from "~~/types"

const deepMerge = (obj1: any, obj2: any) => {
  const result = { ...obj1 }

  for (const key in obj2) {
    if (
      obj2[key] !== null &&
      obj2[key] !== undefined &&
      obj2[key] !== '' &&
      !Array.isArray(obj2[key]) &&
      typeof obj2[key] === 'object'
    ){
      result[key] = deepMerge(obj1[key] || {}, obj2[key])
    } 
    else if (obj2[key] !== undefined && obj2[key] !== null && obj2[key] !== '') {
      result[key] = obj2[key]
    }
  }

  return result
}

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const config = await DB.Config
    .findOne()
    .select(`
      -security
      -article
      -telebot
      -facebook.client_secret 
      -zalo.client_secret 
      -tiktok.client_secret
      -google.client_secret
    `) as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!!config.license) throw 'Trang không chính thống'
    
    const result : any = {
      config: JSON.parse(JSON.stringify(config)),
      collab: {
        active: false,
        user: null,
        code: null
      }
    }

    const code = runtimeConfig.public.collab
    if(!!code){
      const collab = await DB.Collab.findOne({ code: code }).select(`user code info`) as IDBCollab
      if(!collab) throw 'Không tìm thấy cấu hình cộng tác viên'
      result.collab.active = true
      result.collab.user = collab.user
      result.collab.code = collab.code
      result.config = deepMerge(result.config, JSON.parse(JSON.stringify(collab.info)))
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 503, message: e.toString() })
  }
})