import type { IAuth, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current, sort, search, collab : code } = await readBody(event)
    if(!size || !current || !search) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
        
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { 'reg.collab': collab._id }
    if(!!search.key){
      if(search.by == 'USER') match['username'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'MAIL') match['email'] = { $regex : search.key.toLowerCase(), $options : 'i' }
      if(search.by == 'PHONE') match['phone'] = { $regex : search.key, $options : 'i' }
    }

    const list = await DB.User
    .aggregate([
      { $match: match },
      {
        $lookup: {
          from: "Payment",
          localField: "_id",
          foreignField: "user",
          pipeline: [
            { $match: { status: 1 } },
            { $project: { money: 1 } }
          ],
          as: "payments"
        }
      },
      {
        $lookup: {
          from: "CollabIncome",
          localField: "_id",
          foreignField: "user",
          pipeline: [
            { $project: { money: 1 }}
          ],
          as: "incomes"
        }
      },
      { 
        $project: {
          username: 1, 
          level: 1,
          pay: { $sum: '$payments.money' },
          coin: '$currency.coin',
          income: { $sum: '$incomes.money' },
          type: 1,
          block: 1,
          createdAt: 1
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.User.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})