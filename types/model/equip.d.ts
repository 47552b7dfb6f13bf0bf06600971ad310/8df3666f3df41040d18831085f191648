import type { Types } from 'mongoose'

export interface IDBEquip {
  _id: Types.ObjectId

  name: string
  description: string
  type: string
  sex: number
  res: string
  power: number
  offset: {
    info: {
      x: number
      y: number
      scale: number
    }
    idle: {
      x: number
      y: number
      scale: number
    }
  }
  default: boolean
}