import type { IDBCollab, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { size, current } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const match : any = { }
    const collabCode = runtimeConfig.public.collab
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      if(!!collab){
        const list = await DB.GamePrivate.find({ '$expr': { '$in': [ collab._id, '$collab.use' ]} }).select('_id')
        match['game'] = { $in: list.map((item: IDBGamePrivate) => item._id) }
      }
    }

    const list = await DB.GamePrivateServerOpen
    .aggregate([
      { $match: match },
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
      { $sort: { opentime: -1 } },
      {
        $group: {
          _id: '$game._id',
          game: { $first: '$game' },
          opentime: { $first: '$opentime' },
          server_name: { $first: '$server_name' },
        }
      },
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
      { $sort: { opentime: -1 } },
      { $skip: (current - 1) * size },
      { $limit: size }
    ])

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})