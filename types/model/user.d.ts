import type { Types } from 'mongoose'
import type { IDBLevel } from './level'
import type { IDBGuild } from './guild'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  avatar: string
  level: Types.ObjectId | IDBUserLevel
  guild: Types.ObjectId | IDBGuild
  vip: {
    month: {
      enable: boolean
      end: date
    },
    forever: {
      enable: boolean
      end: date
    }
  }
  invite: {
    code: string
    friend: number
  }
  reg: {
    from: Types.ObjectId
    collab: Types.ObjectId
    platform: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  currency: {
    exp: number
    coin: number
    ecoin: number
  }
  china: {
    youxi: boolean
  }
  type: number
  online: boolean
  block: boolean
  token: string
  
  // Function
  save: {
    () : void
  }
}

export interface IDBUserLevel {
  _id: Types.ObjectId
  title: string
  number: number
  exp: number
  bonus: {
    payment: number
    invite: {
      payment: number
    }
  }
  gift: {
    invite: number
  }
  limit: {
    chat: number
    invite: number
  }
  discount: {
    shop: number
  }
}

export interface IDBUserIP {
  _id: Types.ObjectId
  ip: string
  user: Types.ObjectId
}

export interface IDBUserDevice {
  _id: Types.ObjectId
  device: string
  user: Types.ObjectId
}

export interface IDBUserLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : string
  type?: number
  currency?: IDBUser['currency']
  level?: IDBUserLevel
  guild?: IDBGuild
  vip?: IDBUser['vip']
}