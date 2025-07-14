import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, collab : code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.Gate
    .aggregate([
      { $match: { collab: collab._id } },
      {
        $lookup: {
          from: "Payment",
          localField: "_id",
          foreignField: "gate",
          pipeline: [{
            $project: {
              money: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            },
          }],
          as: "payments"
        }
      },
      { 
        $addFields: { 
          payment_count: { $size: '$payments' },
          payment_money: { $sum: '$payments.money' }
        }
      },
      { $project: { payments: 0, createdAt: 0 }},
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Gate.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})