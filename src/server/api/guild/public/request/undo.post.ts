import type { IAuth, IDBGuild, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id } = await readBody(event)
    if (!_id) throw 'Không tìm thấy ID gia tộc'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id })
    .select('guild') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin người dùng'
    if(!!user.guild) throw 'Bạn đã có gia tộc, không thể thực hiện'

    // Get Guild 
    const guild = await DB.Guild.findOne({ _id: _id }).select('name') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'

    // Check Had Request
    const hadRequest = await DB.GuildRequest.findOne({ guild: guild._id, user: user._id })
    if(!hadRequest) throw 'Bạn chưa gửi yêu cầu gia nhập gia tộc này'

    // Remove Request
    await DB.GuildRequest.deleteOne({ guild: guild._id, user: user._id })

    logUser({
      user: user._id,
      action: `Hủy yêu cầu gia nhập gia tộc <b>${guild.name}</b>`,
      type: 'guild.join.undo',
      target: guild._id.toString()
    })

    return resp(event, { message: 'Hủy yêu cầu gia nhập gia tộc thành công'})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})