import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, current } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const match : any = { user: auth._id }

    const list = await DB.GamePrivateUser
    .aggregate([
      { $match: match },
      { $project: { game: 1, played: 1, createdAt: 1 }},
      {
        $lookup: {
          from: "GamePrivate",
          localField: "game",
          foreignField: "_id",
          pipeline: [{
            $project: {
              name: 1, description: 1, code: 1, key: 1, 
              pin: 1, statistic: 1, 
              'image.banner': 1,  'image.icon': 1,  
              rate: 1,
              platform: 1, category: 1
            }
          }],
          as: "game"
        }
      },
      { $unwind: { path: "$game", preserveNullAndEmptyArrays: true }},
      { $addFields: {
        name: "$game.name",
        description: "$game.description",
        code: "$game.code",
        key: "$game.key",
        pin: "$game.pin",
        statistic: "$game.statistic",
        image: "$game.image",
        rate: "$game.rate",
        platform: "$game.platform",
        category: "$game.category",
        played: { $ifNull: ["$played", "$createdAt"] }
      }},
      {
        $lookup: {
          from: "GamePlatform",
          localField: "platform",
          foreignField: "_id",
          pipeline: [
            { $project: { name: 1 }}
          ],
          as: "platform"
        }
      },
      { $unwind: { path: '$platform'} },
      {
        $lookup: {
          from: "GameCategory",
          localField: "category",
          foreignField: "_id",
          pipeline: [
            { $project: { name: 1 }}
          ],
          as: "category"
        }
      },
      { $unwind: { path: '$category'} },
      { $sort: { played: -1 } },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])
    
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})