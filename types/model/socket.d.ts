import type { Types } from 'mongoose'

export interface IDBSocketOnline {
  _id: Types.ObjectId

  user: Types.ObjectId
  socket: string
}

export interface IDBSocketChatGlobal {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  content: string
  type: string
}

export interface IDBSocketChatSingle {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  from: Types.ObjectId
  to: Types.ObjectId
}

export interface IDBSocketChatSingleMessage {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  conversation: Types.ObjectId
  user: Types.ObjectId
  content: string
  isDeleted: boolean
  isRead: boolean
}

export interface IDBSocketChatGuild {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  guild: Types.ObjectId
  user: Types.ObjectId
  content: string
}