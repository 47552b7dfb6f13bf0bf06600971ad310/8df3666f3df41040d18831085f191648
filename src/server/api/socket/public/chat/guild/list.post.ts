import type { IAuth, IDBGuild, IDBSocketChatSingle } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa gia nhập gia tộc nào'
    const { size, skip } = await readBody(event)

    const guild = await DB.Guild.findOne({ _id: auth.guild })
    .populate({ path: 'level' }) as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại' 

    const messages = await DB.SocketChatGuild
    .find({ guild: guild._id })
    .populate({ 
      path: 'user', 
      select: profileSelect(['currency']).user,
      populate: profileSelect().populate,
    })
    .sort({ createdAt: -1 })
    .limit(size)
    .skip(skip)

    return resp(event, { result: { guild, messages } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})