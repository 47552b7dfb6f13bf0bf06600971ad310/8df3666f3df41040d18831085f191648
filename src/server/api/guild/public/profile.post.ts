import type { IAuth, IDBGuild, IDBGuildRequest, IDBGuildLevel, IDBGuildMember, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tài khoản'

    const auth = await getAuth(event, false) as IAuth | null

    const data = await DB.Guild
    .findOne({ _id: _id })
    .populate({ path: 'level' })
    .populate({ 
      path: 'master', 
      select: profileSelect().user, 
      populate: profileSelect().populate,
   }) as IDBGuild
    if(!data) throw 'Không tìm thấy thông tin gia tộc'

    const guild = JSON.parse(JSON.stringify(data))

    // Next Level
    if(!!guild.level){
      const level = guild.level as IDBGuildLevel
      const next = await DB.GuildLevel.findOne({ number: level.number + 1 }).select('number exp') as IDBGuildLevel
      if(!!next) guild.level.next = next
    }

    // Member
    const member = await DB.GuildMember.count({ guild: _id })
    guild.member = member

    // Request Join Auth
    let statusJoin = 0
    if(!!auth){
      const user = await DB.User.findOne({ _id: auth._id }).select('guild') as IDBUser
      if(!!user && !!user.guild) statusJoin = 4 // Đã có gia tộc
      else {
        const authMember = await DB.GuildMember.findOne({ guild: guild._id, user: auth._id }) as IDBGuildMember
        if(!!authMember) statusJoin = 3 // Đã là thành viên
        else {
          const request = await DB.GuildRequest.findOne({ guild: guild._id, user: auth._id }) as IDBGuildRequest
          if(!!request) statusJoin = 2 // Đang yêu cầu tham gia
          else statusJoin = 1 // Chưa tham gia
        }
      }
    }
    guild.statusJoin = statusJoin

    return resp(event, { result: guild })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})