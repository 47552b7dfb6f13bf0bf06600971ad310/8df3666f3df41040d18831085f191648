import type { IAuth, IDBCollab } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, range, collab : code } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!code) throw 'Dữ liệu đầu vào không đủ'

    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
    
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = DayJS(range['start']).startOf('date')
      const end : any = DayJS(range['end']).endOf('date')
      match['time'] = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
    }

    const income = await DB.CollabIncome.aggregate([
      { $match: { 'collab': collab._id } },
      {
        $project: {
          createdAt: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
          },
          vip: { $cond: [{ $regexMatch: { input: "$type", regex: /vip/i } }, '$money', 0] },
          private: { $cond: [{ $regexMatch: { input: "$type", regex: /game.private/i } }, '$money', 0] },
          tool: { $cond: [{ $regexMatch: { input: "$type", regex: /game.tool/i } }, '$money', 0] },
          china: { $cond: [{ $regexMatch: { input: "$type", regex: /game.china/i } }, '$money', 0] },
          money: 1
        }
      },
      {
        $group: {
          _id: '$timeformat',
          time: { $min: '$createdAt' },
          vip: { $sum: '$vip' },
          private: { $sum: '$private' },
          tool: { $sum: '$tool' },
          china: { $sum: '$china' },
          total: { $sum: '$money' },
        }
      },
      { $match: match },
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: income[0].list ? income[0].list : [],
      total: income[0].pagination ? (income[0].pagination[0] ? income[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})