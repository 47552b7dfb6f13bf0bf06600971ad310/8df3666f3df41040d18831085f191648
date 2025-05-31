import type { Server as SocketServer, Socket } from 'socket.io'
import type { Types } from 'mongoose'
import { IDBSocketOnline, IDBUser, IDBUserLevel } from '~~/types'

const sendOnline = async (io : SocketServer, socket? : Socket) => {
  const online = await DB.SocketOnline.aggregate([
    { $addFields: { user: { $cond: [{$not: ["$user"]}, '$socket', '$user']} }},
    { $group: { _id: '$user' }}
  ])
  io.emit('online', online.length)
}

export default async (io : SocketServer, socket : Socket) => {
  await DB.SocketOnline.create({ socket: socket.id })

  socket.on('online-join', async (id? : Types.ObjectId) => {
    if(!id) return sendOnline(io) // Là máy khách không đăng nhập

    // Lấy thống tin User
    const user = await DB.User.findOne({ _id: id })
    .select(profileSelect(['currency']).user)
    .populate(profileSelect().level)
    .populate(profileSelect().guild) as IDBUser
    if(!user) return

    // Cập nhật lại Socket Data
    await DB.SocketOnline.findOneAndUpdate({ socket: socket.id }, { user: user._id }, { upsert: true })

    // Cập nhật lại User Online
    if(!user.online) user.online = true, await user.save()
    
    // Gửi thống báo cho toàn máy chủ nếu đủ điều kiện
    if(
      !!user.vip.month.enable 
      || !!user.vip.forever.enable 
      || (user.level as IDBUserLevel).number >= 10
    ) io.emit('notify-global-push', { user: user, content: `hiện đang trực tuyến` })

    // Set User Channel
    socket.authID = user._id.toString()
    socket.join(socket.authID)

    // Join Guild Channel
    socket.guildChannel = user.guild ? `guild-${user.guild._id}` : null
    socket.join(socket.guildChannel)

    // Gửi đến client của người đăng nhập để bắt đầu lấy các thông tin khác
    socket.emit('online-sign-in')

    sendOnline(io)
  })

  socket.on('online-logout', async () => {
    if(!socket.authID) return // Chưa đăng nhập, không làm gì cả

    // Cập nhật dữ liệu Socket
    await DB.SocketOnline.updateOne({ socket: socket.id }, { user: null })

    // Cập nhật trạng thái online
    const count = await DB.SocketOnline.count({ user: socket.authID })
    if(count == 0) await DB.User.updateOne({ _id: socket.authID }, { online: false })
      
    // Remove Auth User Channel
    !!socket.authID && socket.leave(socket.authID), socket.authID = null
    // Leave Guild Channel
    !!socket.guildChannel && socket.leave(socket.guildChannel), socket.guildChannel = null
    
    sendOnline(io)
  })

  socket.on('disconnect', async () => {
    // Update User Online
    if(!!socket.authID){
      const count = await DB.SocketOnline.count({ user: socket.authID })
      if(count == 1) await DB.User.updateOne({ _id: socket.authID }, { online: false })
    }
    // Delete In Data
    await DB.SocketOnline.deleteOne({ socket: socket.id })
    // Remove User Channel
    !!socket.authID && socket.leave(socket.authID), socket.authID = null
    // Leave Guild Channel
    !!socket.guildChannel && socket.leave(socket.guildChannel), socket.guildChannel = null

    sendOnline(io)
  })
}