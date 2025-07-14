import type { IAuth, IDBCollab, IDBCollabLevel } from "~~/types"
import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, isuse, collab : code } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
            
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { display: true }
    if(!!isuse) match['$expr'] = { '$in': [ collab._id, '$collab.use' ]}

    const list = await DB.Mission.aggregate([
      { $match: match },
      { $addFields: {
        collab_use: { $cond : [{ $in: [ collab._id, '$collab.use' ]}, true, false] }
      }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size },
    ])

    const total = await DB.Mission.count(match)
    return resp(event, { result: { list, total, collab } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})