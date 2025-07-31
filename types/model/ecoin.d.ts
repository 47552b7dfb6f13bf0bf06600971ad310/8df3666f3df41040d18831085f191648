import type { Types } from 'mongoose'

export interface IDBECoinShop {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  name: string
  key: string
  image: string
  price: number
}

export interface IDBECoinShopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  code: Types.ObjectId
  user: Types.ObjectId
  shop: Types.ObjectId
  price: number
  status: number
  contact: {
    phone: string
    mail: string
  }
  bank: {
    name: string
    person: string
    number: string
  }
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
}