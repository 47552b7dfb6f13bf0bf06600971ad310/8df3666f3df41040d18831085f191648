import type { IAuth, IDBUser, IDBGuild } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa có gia tộc'

    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('name master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'
    
    // Update User
    await DB.User.updateOne({ _id: auth._id }, { $set: { guild: null } })

    // Leave Guild
    await DB.GuildMember.deleteOne({ guild: guild._id, user: auth._id })

    // Log
    logUser({
      user: auth._id,
      action: `Rời khỏi gia tộc <b>${guild.name}</b>`,
      type: 'guild.leave',
      target: guild._id.toString()
    })
    
    return resp(event, { message: 'Rời khỏi gia tộc thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})