import type { Types } from 'mongoose'
import type { IDBUser } from './user'

export interface IDBInvite {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  from: Types.ObjectId | IDBUser
  user: Types.ObjectId | IDBUser
  payment: number
  reward: number
  receive: {
    invitation: boolean
  }
}

export interface IDBInviteReward {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  invite: Types.ObjectId
  from: Types.ObjectId | IDBUser
  user: Types.ObjectId | IDBUser
  number: number
  reason: string
}