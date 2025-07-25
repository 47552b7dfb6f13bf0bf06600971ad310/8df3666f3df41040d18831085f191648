import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { search } = await readBody(event)
    if(!search) throw 'Vui lòng nhập từ khóa tìm kiếm'

    const match : any = { display: true }

    const collabCode = runtimeConfig.public.collab
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab) match['$expr'] = { '$in': [ collab._id, '$collab.use' ]}
    }

    if(!!search){
      const key = formatVNString(search, '-')
      match['$or'] = [
        { 'key': { $regex : key, $options : 'i' }},
        { 'code': { $regex : key, $options : 'i' }},
      ]
    }

    const result : any = {}

    const listPrivate = await DB.GamePrivate
    .find(match)
    .select('name code key pin statistic description image.icon')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort({ 'statistic.play' : 1 })
    .limit(5)
    if(listPrivate.length > 0) result.private = listPrivate

    const listTool = await DB.GameTool
    .find(match)
    .select('name code key pin statistic description image.icon')
    .populate({ path: 'platform', select: 'name key' })
    .populate({ path: 'category', select: 'name key' })
    .sort({ 'statistic.play' : 1 })
    .limit(5)
    if(listTool.length > 0) result.tool = listTool

    // const listChina = await DB.GameChina
    // .find(match)
    // .select('name code key pin statistic description image.icon')
    // .populate({ path: 'platform', select: 'name key' })
    // .populate({ path: 'category', select: 'name key' })
    // .sort({ 'statistic.play' : 1 })
    // .limit(5)
    // if(listChina.length > 0) result.china = listChina

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})