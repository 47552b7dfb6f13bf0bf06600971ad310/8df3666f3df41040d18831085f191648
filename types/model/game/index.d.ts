import type { Types } from 'mongoose'
export { 
  IDBGameTool, 
  IDBGameToolNews,
  IDBGameToolServerOpen,
  IDBGameToolUser, 
  IDBGameToolPayment, 
  IDBGameToolRecharge, 
  IDBGameToolItem ,
  IDBGameToolComment,
  IDBGameToolLogAdmin
} from './tool'
export { 
  IDBGameChina, 
  IDBGameChinaUser, 
  IDBGameChinaPayment, 
  IDBGameChinaComment,
  IDBGameChinaLogAdmin
} from './china'
export {
  IDBGamePrivate,
  IDBGamePrivateNews,
  IDBGamePrivateServerOpen,
  IDBGamePrivateUser, IDBGamePrivateUserLogin,
  IDBGamePrivateRecharge, IDBGamePrivateRechargeHistory,
  IDBGamePrivateItem, IDBGamePrivateItemBox,
  IDBGamePrivateShopItem, IDBGamePrivateShopItemHistory,
  IDBGamePrivateShopPack, IDBGamePrivateShopPackHistory,
  IDBGamePrivateGiftcode, IDBGamePrivateGiftcodeHistory,
  IDBGamePrivateEvent, IDBGamePrivateEventHistory,
  IDBGamePrivateEgg, IDBGamePrivateEggHistory,
  IDBGamePrivateWheel, IDBGamePrivateWheelHistory,
  IDBGamePrivateRank, IDBGamePrivateRankLog,
  IDBGamePrivateComment,
  IDBGamePrivateLogAdmin
} from './private'

export interface IDBGamePlatform {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  icon: string
  key: string
  display: boolean
}

export interface IDBGameCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  icon: string
  key: string
  display: boolean
}