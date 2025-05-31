import { Types } from 'mongoose'
import type { Server as SocketServer, Socket } from 'socket.io'

export default (io : SocketServer, socket : Socket) => {
  socket.on('notify-single-new', async () => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'

      const result = await DB.LogUser.aggregate([
        { $match: { user: new Types.ObjectId(socket.authID), watched: false } },
        { $group: { _id: '$user', unreadCount: { $sum: 1 }}},
      ])

      socket.emit('notify-single-new', result[0] ? result[0].unreadCount : 0)
    }
    catch(e:any) {
      return
    }
  })
}