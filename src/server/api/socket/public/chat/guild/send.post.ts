import type { IAuth, IDBGuild, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa gia nhập gia tộc nào'

    const { text } = await readBody(event)
    if(!text) throw 'Vui lòng nhập nội dung'
    if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

    // Get User
    const user = await DB.User
    .findOne({ _id: auth._id })
    .select(profileSelect().user)
    .populate(profileSelect().level)
    .populate(profileSelect().guild) as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'

    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('_id') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại' 
    if(guild._id.toString() !== auth.guild.toString()) throw 'Bạn không phải thành viên của gia tộc này'

    // Make Chat
    let content = text
    const match = text.match(/^@(\S+)/)
    if(!!match){
      const userTag = await DB.User.findOne({ username: match[1] }).select('username') as IDBUser
      if(!userTag) throw 'Tài khoản trả lời không tồn tại'

      let tagArr = text.split(`@${userTag.username} `)
      if(!tagArr[1]) throw 'Vui lòng nhập nội dung trả lời'

      content = `<b class="text-primary">@${userTag.username}</b> ${tagArr[1]}`
    }

    const chat = await DB.SocketChatGuild.create({ guild: guild._id, user: user._id, content: content })
    const result = JSON.parse(JSON.stringify(chat))
    result.user = user
    IO.to(`guild-${guild._id.toString()}`).emit('chat-guild-push', result)
    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})