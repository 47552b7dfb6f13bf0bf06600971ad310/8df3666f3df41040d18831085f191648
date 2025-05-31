import type { Mongoose } from 'mongoose'
import type { IDBSocketChatGlobal, IDBSocketChatSingle, IDBSocketChatSingleMessage, IDBSocketOnline } from '~~/types'
import { IDBSocketChatGuild } from '~~/types/model/socket'

export const DBSocketOnline = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketOnline>({ 
    socket: { type: 'String' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  })

  const model = mongoose.model('SocketOnline', schema, 'SocketOnline')
  const autoDelete = async () => await model.deleteMany()
  autoDelete()

  return model 
}

export const DBSocketChatGlobal= (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatGlobal>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    content: { type: String },
    type: { type: String, default: 'USER' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('SocketChatGlobal', schema, 'SocketChatGlobal')
  // const autoDelete = async () => await model.deleteMany()
  // autoDelete()

  return model 
}

export const DBSocketChatSingle = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatSingle>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
  }, {
    timestamps: true
  })

  schema.index({ from: 1, to: 1 }, { unique: true })

  const model = mongoose.model('SocketChatSingle', schema, 'SocketChatSingle')
  return model 
}

export const DBSocketChatSingleMessage = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatSingleMessage>({ 
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'SocketChatSingle', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    content: { type: String },
    isDeleted: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false }
  }, {
    timestamps: true
  })

  schema.index({ content: 'text' })
  const model = mongoose.model('SocketChatSingleMessage', schema, 'SocketChatSingleMessage')
  return model 
}

export const DBSocketChatGuild = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChatGuild>({ 
    guild: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('SocketChatGuild', schema, 'SocketChatGuild')
  return model 
}