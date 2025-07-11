import type { Types } from "mongoose"

export interface IDBMission {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  type: string
  name: string
  expired: date
  need: {
    game: {
      private: {
        source: Types.ObjectId
        level: number
        power: number
      }
      tool: {
        source: Types.ObjectId
      }
    }
    payment: {
      first: number
      second: number
      money: number
    }
    level: Types.ObjectId
    vip: string
  }
  ecoin: number
  display: boolean
}

export interface IDBMissionHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  user: Types.ObjectId
  mission: Types.ObjectId
  type: string
  ecoin: number
}