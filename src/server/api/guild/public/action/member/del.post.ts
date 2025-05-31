import type { IAuth, IDBGuild, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa có gia tộc'

    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID thành viên'
    
    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('name master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'
    if(guild.master.toString() !== auth._id.toString()) throw 'Bạn không phải là người sáng lập gia tộc'
    if(_id.toString() == auth._id.toString()) throw 'Không thể kích chính mình'

    // Get User Delete
    const userDelete = await DB.User.findOne({ _id: _id }).select('username guild') as IDBUser
    if(!userDelete) throw 'Thành viên không tồn tại'
    if(!userDelete.guild) throw 'Thành viên này chưa có gia tộc'
    if(userDelete.guild.toString() != guild._id.toString()) throw 'Thành viên này không trong gia tộc của bạn'

    // Delete
    await DB.User.updateOne({ _id: userDelete._id }, { $set: { guild: null } })
    await DB.GuildMember.deleteOne({ guild: guild._id, user: userDelete._id })
    
    // Log
    logUser({
      user: auth._id,
      action: `Kích <b>${userDelete.username}</b> khỏi gia tộc <b>${guild.name}</b> của mình`,
      type: 'guild.member.delete',
      target: guild._id.toString()
    })

    logUser({
      user: userDelete._id,
      action: `Bị kích khỏi gia tộc <b>${guild.name}</b>`,
      type: 'guild.member.delete',
      target: guild._id.toString()
    })

    IO.to(userDelete._id.toString()).emit('guild-auth-del')
    
    return resp(event, { message: 'Kích thành viên thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})