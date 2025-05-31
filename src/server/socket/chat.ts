import { Types } from 'mongoose'
import type { Server as SocketServer, Socket } from 'socket.io'
import type { IDBSocketChatSingle, IDBUser, IDBUserLevel, IDBGuild } from "~~/types"

export default (io : SocketServer, socket : Socket) => {
  // Chat Global
  socket.on('chat-global-send', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'
      const { text } = data
      if(!text) throw 'Vui lòng nhập nội dung'
      if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

      // Get User
      const user = await DB.User
      .findOne({ _id: socket.authID })
      .select(profileSelect().user)
      .populate(profileSelect().level)
      .populate(profileSelect().guild) as IDBUser
      
      // Check Limit Chat
      const level = user.level as IDBUserLevel
      const max = level.limit.chat
      const now = DayJS(Date.now())
      const start = now.startOf('date')
      const end = now.endOf('date')
      const matchTime = { $gte: new Date(start['$d']), $lte: new Date(end['$d']) }
      const historyChat = await DB.SocketChatGlobal.aggregate([
        { $match: { user: user._id, createdAt: matchTime }},
        { $project: {
          createdAt: 1,
          timeformat: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }}
        }},
        { $group: { _id: '$timeformat', count: { $count: {} } }},
      ])
      if(!!historyChat[0] && historyChat[0].count >= max) throw `Bạn đã đạt giới hạn chat thế giới trong ngày`
  
      // Check Tag
      const match = text.match(/^@(\S+)/)

      // Default Chat
      if(!match){
        const chat = await DB.SocketChatGlobal.create({ user: user._id, content: text })
        const result = JSON.parse(JSON.stringify(chat))
        result.user = user
        return io.emit('chat-global-push', result)
      }

      // Smart Chat
      if(!!match){
        // Notify Global
        if(match[1] == 'notify'){
          if(user.type != 100) throw 'Chức năng chỉ dành cho Quản Trị Viên'
          let notifyArr = text.split("@notify ")
          if(!notifyArr[1]) throw 'Vui lòng nhập nội dung thông báo'
          return io.emit('notify-global-push', { user: user, content: notifyArr[1] })
        }
  
        // Tag
        const userTag = await DB.User.findOne({ username: match[1] }).select('username') as IDBUser
        if(!userTag) throw 'Tài khoản trả lời không tồn tại'
        let tagArr = text.split(`@${userTag.username} `)
        if(!tagArr[1]) throw 'Vui lòng nhập nội dung trả lời'
        const content = `<b class="text-primary">@${userTag.username}</b> ${tagArr[1]}`
        const chat = await DB.SocketChatGlobal.create({ user: user._id, content: content })
        const result = JSON.parse(JSON.stringify(chat))
        result.user = user
        return io.emit('chat-global-push', result)
      }
    }
    catch(e:any) {
      socket.emit('chat-global-send-error', { message: e.toString() })
    }
  })

  // Chat Guild
  socket.on('chat-guild-send', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'
      if(!socket.guildChannel) throw 'Bạn chưa vào kênh gia tộc nào'

      const guildArr = socket.guildChannel.split('-')
      const guildID = guildArr[1]
      if(!guildID) throw 'Kênh gia tộc không xác định'
      
      const { text } = data
      if(!text) throw 'Vui lòng nhập nội dung'
      if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

      // Get User
      const user = await DB.User
      .findOne({ _id: socket.authID })
      .select(profileSelect().user)
      .populate(profileSelect().level)
      .populate(profileSelect().guild) as IDBUser
      if(!user) throw 'Tài khoản không tồn tại'

      // Get Guild
      const guild = await DB.Guild.findOne({ _id: guildID }).select('_id') as IDBGuild
      if(!guild) throw 'Gia tộc không tồn tại' 

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
      return io.to(socket.guildChannel).emit('chat-guild-push', result)
    }
    catch(e:any) {
      socket.emit('chat-global-send-error', { message: e.toString() })
    }
  })

  // Chat Guild
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

  // Chat Single
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
      // socket.emit('chat-single-read-error', { message: e.toString() })
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