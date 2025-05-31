import type { Types } from 'mongoose'

export interface IDBCollabLevel {
  _id: Types.ObjectId

  number: number
  commission: {
    game: {
      private: number
      china: number
      tool: number
    }
    vip: number
  },
  price: number
}

export interface IDBCollab {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  level: Types.ObjectId
  code: string
  user: Types.ObjectId
  link: string

  money: number

  privilege: {
    edit_info: boolean
    edit_gate: boolean
  }

  info: {
    name: string
    short_name: string
    description: string
    og_image: string
    logo_image: string
    download: {
      windows: string
      mac: string
      android: string
      ios: string
    }
    contact: {
      name: string
      phone: string
      email: string
      address: string
      prefix: string
    }
    social: {
      facebook: string
      messenger: string
      zalo: string
      telegram: string
      tiktok: string
      game: {
        china: string
        private: string
        tool: string
      }
    }
  }
}

export interface IDBCollabNotify {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  collab: Types.ObjectId
  title: string
  content: string
  pin: boolean
}

export interface IDBCollabIncome {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  collab: Types.ObjectId
  type: string
  user: Types.ObjectId
  content: string
  coin: number
  money: number
  commission: {
    game: number
    level: number
  }
  game?: Types.ObjectId
  source?: Types.ObjectId
}

export interface IDBCollabWithdraw {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  collab: Types.ObjectId
  user: Types.ObjectId
  code: string
  money: number
  status: number
  bank: {
    name: string
    number: string
    person: string
  }
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
}