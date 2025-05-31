import type { IAuth, IDBGuild } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa có gia tộc'

    const { size, current, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('_id') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'

    const match : any = { guild: guild._id }
    if(!!search) {
      const users = await DB.User.find({
        username : { $regex : search.toLowerCase(), $options : 'i' }
      }).select('_id')
      match['user'] = { $in: users.map(i => i._id) }
    }

    const list = await DB.GuildDonate
    .find(match)
    .populate({ 
      path: 'user', 
      select: profileSelect(['currency']).user,
      populate: profileSelect().populate,
    })
    .sort({ createdAt: -1 })
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.GuildDonate.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})