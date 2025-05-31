import type { IAuth, IDBGuild, IDBSocketChatGuild } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa gia nhập gia tộc nào'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào sai'

    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại' 
    if(guild.master.toString() !== auth._id.toString()) throw 'Bạn không phải lãnh đạo gia tộc'

    const chat = await DB.SocketChatGuild.findOne({ _id: _id }).select('_id') as IDBSocketChatGuild
    if(!chat) throw 'Đoạn tin nhắn không tồn tại'

    await DB.SocketChatGuild.deleteOne({ _id: chat._id })
    IO.to(`guild-${guild._id.toString()}`).emit('chat-guild-del', chat._id)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})