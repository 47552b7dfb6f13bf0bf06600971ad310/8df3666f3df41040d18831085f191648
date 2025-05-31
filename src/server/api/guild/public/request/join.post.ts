import type { IAuth, IDBGuild, IDBGuildLevel, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id } = await readBody(event)
    if (!_id) throw 'Không tìm thấy ID gia tộc'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id })
    .select('level guild') 
    .populate({ path: 'level', select: 'number' }) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin người dùng'
    if(!!user.guild) throw 'Bạn đã có gia tộc, không thể tham gia'

    // Get Guild 
    const guild = await DB.Guild.findOne({ _id: _id })
    .populate({ path: 'level' }) as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'
    if(!guild.request.active) throw 'Gia tộc này đang không nhận thêm thành viên'

    // Check Level
    const levelUser = (user.level as IDBUserLevel).number
    const levelGuild = guild.request.level
    if(levelUser < levelGuild) throw 'Cấp độ tài khoản không đủ để tham gia gia tộc'

    // Check Member Limit
    const memberCount = await DB.GuildMember.count({ guild: guild._id })
    if(memberCount >= (guild.level as IDBGuildLevel).limit.member) throw 'Gia tộc đã đầy thành viên, không thể tham gia'

    // Check Auto Request
    if(!guild.request.auto) {
      const hadRequest = await DB.GuildRequest.findOne({ guild: guild._id, user: user._id })
      if(!!hadRequest) throw 'Bạn đã gửi yêu cầu gia nhập gia tộc này rồi'

      await DB.GuildRequest.deleteMany({ user: user._id }) // Xóa các yêu cầu tham gia khác
      await DB.GuildRequest.create({ guild: guild._id, user: user._id })

      logUser({
        user: user._id,
        action: `Yêu cầu gia nhập gia tộc <b>${guild.name}</b>`,
        type: 'guild.join.request',
        target: guild._id.toString()
      })

      return resp(event, { message: 'Gửi yêu cầu tham gia thành công' , result: 0 })
    }
    else {
      await DB.GuildRequest.deleteMany({ user: user._id }) // Xóa các yêu cầu tham gia khác
      await DB.GuildMember.create({ guild: guild._id, user: user._id })
      await DB.User.updateOne({ _id: user._id }, { guild: guild._id })

      logUser({
        user: user._id,
        action: `Gia nhập gia tộc <b>${guild.name}</b>`,
        type: 'guild.join.accept',
        target: guild._id.toString()
      })

      return resp(event, { message: 'Gia nhập gia tộc thành công', result: 1 })
    }
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})