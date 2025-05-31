import { Types } from 'mongoose'
import type { Server as SocketServer, Socket } from 'socket.io'
import type { IDBSocketChatSingle, IDBUser } from "~~/types"

export default (io : SocketServer, socket : Socket) => {
  socket.on('chat-guild-join-channel', async (data) => {
    try { 
      if(!socket.authID) throw 'Bạn chưa đăng nhập'
      const user = await DB.User.findOne({ _id: socket.authID }).select('guild') as IDBUser
      if(!user) throw 'Tài khoản không tồn tại'
      if(!user.guild) throw 'Bạn chưa tham gia guild nào'

      if(!!socket.guildChannel && socket.guildChannel == `guild-${user.guild.toString()}`) return
      socket.guildChannel = `guild-${user.guild.toString()}`
      socket.join(socket.guildChannel)
    }
    catch(e:any) {
      return
    }
  })

  socket.on('chat-guild-leave-channel', async (data) => {
    try { 
      if(!socket.authID) throw 'Bạn chưa đăng nhập'
      if(!socket.guildChannel) throw 'Bạn chưa vào kênh guild'
      
      socket.leave(socket.guildChannel)
      socket.guildChannel = null
    }
    catch(e:any) {
      return
    }
  })

  socket.on('chat-single-send', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'

      const { conversation : _id, text } = data
      if(!_id) throw 'Không tìm thấy ID cuộc trò chuyện'
      if(!text) throw 'Vui lòng nhập nội dung'
      if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

      const conversation = await DB.SocketChatSingle.findOne({ _id: _id }) as IDBSocketChatSingle
      if(!conversation) throw 'Cuộc trò chuyện không tồn tại'
      if(conversation.from.toString() != socket.authID && conversation.to.toString() != socket.authID) throw 'Bạn không có quyền tham gia cuộc trò chuyện'
    
      const newMessage = await DB.SocketChatSingleMessage.create({ 
        conversation: conversation._id, 
        user: socket.authID,
        content: text,
        isRead: false
      })

      const sendTo = conversation.from.toString() == socket.authID ? conversation.to.toString() : conversation.from.toString()
      io.to(sendTo).emit('chat-single-push', newMessage)
      socket.emit('chat-single-push-me', newMessage)
    }
    catch(e:any) {
      socket.emit('chat-single-send-error', { message: e.toString() })
    }
  })

  socket.on('chat-single-read', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'

      const { conversation : _id } = data
      const conversation = await DB.SocketChatSingle.findOne({ _id: _id }) as IDBSocketChatSingle
      if(!conversation) throw 'Cuộc trò chuyện không tồn tại'
      if(conversation.from.toString() != socket.authID && conversation.to.toString() != socket.authID) throw 'Bạn không có quyền tham gia cuộc trò chuyện'

      const to = conversation.from.toString() == socket.authID ? conversation.to.toString() : conversation.from.toString()
      await DB.SocketChatSingleMessage.updateMany({ 
        user: to,
        conversation: conversation._id, 
        isRead: false
      }, {
        $set: { isRead: true }
      })
    }
    catch(e:any) {
      socket.emit('chat-single-read-error', { message: e.toString() })
    }
  })

  socket.on('chat-single-new', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'

      const result = await DB.SocketChatSingleMessage.aggregate([
        { $match: {
          isRead: false,
          user: { $ne: new Types.ObjectId(socket.authID) }
        }},
        { $group: {
          _id: '$conversation',
          unreadCount: { $sum: 1 }
        }},
        { $lookup: {
          from: 'SocketChatSingle',
          localField: '_id',
          foreignField: '_id',
          as: 'conversationInfo'
        }},
        { $unwind: '$conversationInfo' },
        { $match: {
          $or: [
            { 'conversationInfo.from': new Types.ObjectId(socket.authID) },
            { 'conversationInfo.to': new Types.ObjectId(socket.authID) }
          ]
        }},
        {  $project: {
          _id: 0,
          conversationId: '$_id',
          unreadCount: 1
        }}
      ])

      const count = result.filter(item => item.unreadCount > 0).length
      socket.emit('chat-single-new', count)
    }
    catch(e:any) {
      return
    }
  })
}