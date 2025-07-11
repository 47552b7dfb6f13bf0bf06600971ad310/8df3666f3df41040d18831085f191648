export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const data = await DB.Mission
    .find()
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const list = JSON.parse(JSON.stringify(data))

    for (let i = 0; i < list.length; i++) {
      list[i].active = await getMissionActive(event, list[i])
    }
    
    const total = await DB.Mission.count()

    return resp(event, { result:  { list, total } })
  }
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})