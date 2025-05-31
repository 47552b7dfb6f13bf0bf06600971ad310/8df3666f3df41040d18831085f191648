import type { IAuth, IDBGuild, IDBGuildRequest, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa có gia tộc'

    const { _id, type } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tài khoản'
    if(!type) throw 'Không tìm thấy kiểu xác thức'
    if(type != 1 && type != 2) throw 'Kiểu xác thực không hỗ trợ'
    
    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('name master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'
    if(guild.master.toString() !== auth._id.toString()) throw 'Bạn không phải là người sáng lập gia tộc'
    if(_id.toString() == auth._id.toString()) throw 'Không thể xác thực chính mình'

    // Get User Verify
    const userVerify = await DB.User.findOne({ _id: _id }).select('username guild') as IDBUser
    if(!userVerify) throw 'Tài khoản không tồn tại'
    if(!!userVerify.guild) throw 'Tài khoản này đã có gia tộc'

    // Check Request
    const request = await DB.GuildRequest.findOne({ user: userVerify._id, guild: guild._id }) as IDBGuildRequest
    if(!request) throw 'Yêu cầu gia nhập không tồn tại'

    // Accept
    if(type == 1){
      await DB.User.updateOne({ _id: userVerify._id }, { guild: guild._id })
      await DB.GuildMember.create({ guild: guild._id, user: userVerify._id })
      await DB.GuildRequest.deleteMany({ user: userVerify._id }) // Xóa các yêu cầu tham gia khác
      
      logUser({
        user: auth._id,
        action: `Đồng ý cho <b>${userVerify.username}</b> vào gia tộc <b>${guild.name}</b> của mình`,
        type: 'guild.join.accept',
        target: guild._id.toString()
      })

      logUser({
        user: userVerify._id,
        action: `Gia nhập gia tộc <b>${guild.name}</b>`,
        type: 'guild.join.accept',
        target: guild._id.toString()
      })

      IO.to(userVerify._id.toString()).emit('guild-auth-join')
    }

    // Refuse
    if(type == 2){
      await DB.GuildRequest.deleteMany({ user: userVerify._id }) // Xóa các yêu cầu tham gia khác

      logUser({
        user: auth._id,
        action: `Từ chối <b>${userVerify.username}</b> vào gia tộc <b>${guild.name}</b> của mình`,
        type: 'guild.join.accept',
        target: guild._id.toString()
      })

      logUser({
        user: userVerify._id,
        action: `Bị từ chối gia nhập gia tộc <b>${guild.name}</b>`,
        type: 'guild.join.refuse'
      })
    }

    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})