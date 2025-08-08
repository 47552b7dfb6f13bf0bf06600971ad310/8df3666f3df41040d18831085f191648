import { Types } from "mongoose"
import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, user, collab : code } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!user) throw 'Dư liệu người dùng sai'

    if(!code) await checkPermission('ip.list', auth.type)
    else {
      const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
      if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
      if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
    }

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { user: new Types.ObjectId(user) }

    const logs = await DB.UserIP.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "BlockIP",
          localField: "ip",
          foreignField: "ip",
          as: "block"
        }
      },
      { $unwind: { path: '$block', preserveNullAndEmptyArrays: true }},
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
      list: logs[0].list ? logs[0].list : [],
      total: logs[0].pagination ? (logs[0].pagination[0] ? logs[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})