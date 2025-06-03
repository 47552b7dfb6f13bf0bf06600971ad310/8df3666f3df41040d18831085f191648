import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('device.list', auth.type)

    const { size, current, sort, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { }
    if(search.key){
      if(search.by == 'DEVICE'){
        match['device'] = { $regex : search.key, $options : 'i' }
      }
      if(search.by == 'USER') {
        const users = await DB.User.find({
          username : { $regex : search.key.toLowerCase(), $options : 'i' }
        }).select('_id')
        match['user'] = { $in: users.map(i => i._id) }
      }
    }

    const logs = await DB.UserDevice.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          pipeline: [
            { $project: { username: 1 }}
          ],
          as: "user"
        }
      },
      { $unwind: { path: '$user'} },
      { $group: {
        _id: '$device',
        users: { $push: '$user' },
        count: { $count: {} },
      }},
      {
        $lookup: {
          from: "BlockDevice",
          localField: "_id",
          foreignField: "device",
          as: "block"
        }
      },
      { $unwind: { path: '$block', preserveNullAndEmptyArrays: true }},
      { $project: { device: '$_id', users: 1, count: 1, block: { $cond: [{$not: ["$block"]}, 0, 1]} }},
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