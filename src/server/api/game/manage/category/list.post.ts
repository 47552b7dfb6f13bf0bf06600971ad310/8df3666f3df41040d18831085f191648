import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('game.category.list', auth.type)

    const { size, current, sort } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const list = await DB.GameCategory
    .aggregate([
      {
        $lookup: {
          from: "GameTool",
          localField: "_id",
          foreignField: "category",
          as: "GameTool",
          pipeline: [{
            $project: { _id: 1 },
          }],
        }
      },
      {
        $project: {
          name: 1,
          key: 1,
          icon: 1,
          updatedAt: 1,
          createdAt: 1,
          count: { 
            $size: '$GameTool'
          }
        }
      },
      { $sort: sorting },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.GameCategory.count()
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})