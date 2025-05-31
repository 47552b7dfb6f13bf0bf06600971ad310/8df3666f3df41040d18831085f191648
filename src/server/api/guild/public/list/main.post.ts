import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const match : any = { }
    if(!!search) match['name'] = { $regex : search, $options : 'i' }

    const list = await DB.Guild
    .aggregate([
      {
        $lookup: {
          from: "GuildLevel",
          localField: "level",
          foreignField: "_id",
          as: "level"
        }
      },
      { $unwind: { path: "$level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "GuildMember",
          localField: "_id",
          foreignField: "guild",
          as: "members"     
        }
      },
      { $addFields: {
        member: { $size: "$members" }
      }},
      { $project: { 'members' : 0 }},
      { $sort: { 'level.number' : -1 } },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    const total = await DB.Guild.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})