import type { Types } from 'mongoose'

export interface IDBGuild {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  description: string
  level: Types.ObjectId | IDBGuildLevel
  currency: {
    exp: number
  }
  request: {
    active: boolean
    auto: boolean
    level: number
  }
  master: Types.ObjectId
}

export interface IDBGuildLevel {
  _id: Types.ObjectId

  number: number
  exp: number
  bonus: {
    payment: number
  }
  limit: {
    member: number
  }
}

export interface IDBGuildRequest {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  guild: Types.ObjectId
  user: Types.ObjectId
}

export interface IDBGuildMember {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  guild: Types.ObjectId
  user: Types.ObjectId
  type: number
  donate: number
}

export interface IDBGuildDonate {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  guild: Types.ObjectId
  user: Types.ObjectId
  coin: number
}