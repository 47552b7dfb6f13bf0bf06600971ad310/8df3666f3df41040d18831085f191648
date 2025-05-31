import type { Server as SocketServer, Socket } from 'socket.io'
import OnlineAction from './online'
import ChatAction from './chat'
import NotifyAction from './notify'

export default (event : any, io : SocketServer) => {
  io.on('connection', (socket : Socket) => {
    OnlineAction(io, socket)
    ChatAction(io, socket)
    NotifyAction(io, socket)
  })

  global.IO = io
}