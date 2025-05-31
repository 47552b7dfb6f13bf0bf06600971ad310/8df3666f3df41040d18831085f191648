import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, skip } = await readBody(event)
    
    const conversations = await DB.SocketChatSingle.
    aggregate([
      { $match: { $or: [{ to: auth._id }, { from: auth._id }] }},
      {
        $lookup: {
          from: "User",
          localField: "to",
          foreignField: "_id",
          as: "to",
          pipeline: [{ $project: profileSelect().userObj }]
        }
      },
      { $unwind: { path: "$to", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "UserLevel",
          localField: "to.level",
          foreignField: "_id",
          as: "to.level",
          pipeline: [{ $project: profileSelect().levelObj }]
        }
      },
      { $unwind: { path: "$to.level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "Guild",
          localField: "to.guild",
          foreignField: "_id",
          as: "to.guild",
          pipeline: [{ $project: profileSelect().guildObj }]
        }
      },
      { $unwind: { path: "$to.guild", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "GuildLevel",
          localField: "to.guild.level",
          foreignField: "_id",
          as: "to.guild.level",
          pipeline: [{ $project: profileSelect().guildLevelObj }]
        }
      },
      { $unwind: { path: "$to.guild.level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "User",
          localField: "from",
          foreignField: "_id",
          as: "from",
          pipeline: [{ $project: profileSelect().userObj}]
        }
      },
      { $unwind: { path: "$from", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "UserLevel",
          localField: "from.level",
          foreignField: "_id",
          as: "from.level",
          pipeline: [{ $project: profileSelect().levelObj }]
        }
      },
      { $unwind: { path: "$from.level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "Guild",
          localField: "from.guild",
          foreignField: "_id",
          as: "from.guild",
          pipeline: [{ $project: profileSelect().guildObj }]
        }
      },
      { $unwind: { path: "$from.guild", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "GuildLevel",
          localField: "from.guild.level",
          foreignField: "_id",
          as: "from.guild.level",
          pipeline: [{ $project: profileSelect().guildLevelObj }]
        }
      },
      { $unwind: { path: "$from.guild.level", preserveNullAndEmptyArrays: true }},
      {
        $lookup: {
          from: "SocketChatSingleMessage",
          localField: "_id",
          foreignField: "conversation",
          as: "last",
          pipeline: [
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ]
        }
      },
      { $unwind: { path: "$last", preserveNullAndEmptyArrays: true }},
      { $addFields: {
        update: { $cond: [{$not: ["$last"]}, '$createdAt', '$last.createdAt']}
      }},
      {
        $facet: {
          list: [
            { $sort: { 'update': -1 } },
            { $skip: skip },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])
    
    return resp(event, { result: { 
      list: conversations[0].list ? conversations[0].list : [],
      total: conversations[0].pagination ? (conversations[0].pagination[0] ? conversations[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})