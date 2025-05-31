import type { IAuth, IDBGuild } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa có gia tộc'

    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('name master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'
    if(guild.master.toString() !== auth._id.toString()) throw 'Bạn không phải là người sáng lập gia tộc'

    // Update Users
    await DB.User.updateMany({ guild: guild._id }, { $set: { guild: null } })

    // Delete Guild
    await DB.SocketChatGuild.deleteMany({ guild: guild._id })
    await DB.GuildMember.deleteMany({ guild: guild._id })
    await DB.GuildRequest.deleteMany({ guild: guild._id })
    await DB.Guild.deleteOne({ _id: guild._id })
    
    // Log
    logUser({
      user: auth._id,
      action: `Giải tán gia tộc <b>${guild.name}</b> của mình`,
      type: 'guild.delete'
    })

    IO.to(`guild-${guild._id.toString()}`).emit('guild-delete')
    
    return resp(event, { message: 'Xóa gia tộc thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})