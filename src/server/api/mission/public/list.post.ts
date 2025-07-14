import type { IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match: any = { display: true }

    const collabCode = runtimeConfig.public.collab
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab) match['$expr'] = { '$in': [ collab._id, '$collab.use' ]}
    }

    const data = await DB.Mission
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const list = JSON.parse(JSON.stringify(data))

    for (let i = 0; i < list.length; i++) {
      list[i].active = await getMissionActive(event, list[i])
    }
    
    const total = await DB.Mission.count(match)

    return resp(event, { result:  { list, total } })
  }
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})