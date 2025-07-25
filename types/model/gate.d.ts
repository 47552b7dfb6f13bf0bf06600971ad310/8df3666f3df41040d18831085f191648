import type { Types } from 'mongoose'

export interface IDBGate {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  collab: Types.ObjectId
  type: number
  name: string
  person: string
  number: string
  key: string
  qrcode: string
  display: boolean
}