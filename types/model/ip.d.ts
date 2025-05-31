import type { Types } from 'mongoose'

export interface IDBAdminIP {
  _id: Types.ObjectId
  ip: string
}

export interface IDBBlockIP {
  _id: Types.ObjectId
  ip: string
}

export interface IDBBlockDevice {
  _id: Types.ObjectId
  device: string
}