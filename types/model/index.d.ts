import type { Model } from 'mongoose'

export { IDBConfig, IDBConfigStore, IDBConfigPermission } from './config'
export { IDBNews, IDBNewsCategory } from './news'

export { IDBAdsFrom } from './ads'

export { IDBUser, IDBUserLevel, IDBUserStore, IDBUserDevice, IDBUserIP, IDBUserLogin } from './user'

export { IDBInvite, IDBInviteReward } from './invite'

export { IDBGuild, IDBGuildLevel, IDBGuildRequest, IDBGuildMember, IDBGuildDonate } from './guild'

export { IDBGate } from './gate'
export { IDBPayment } from './payment'
export { IDBSpend } from './spend'

export { IDBVoucher, IDBVoucherHistory } from './voucher'

export { IDBLogAdmin, IDBLogUser } from './log'
export { IDBAdminIP, IDBBlockIP, IDBBlockDevice } from './ip'

export {
  IDBCollabLevel,
  IDBCollab,
  IDBCollabNotify,
  IDBCollabIncome,
  IDBCollabWithdraw
} from './collab'

export { 
  IDBGamePlatform, 
  IDBGameCategory, 

  IDBGameTool, 
  IDBGameToolNews,
  IDBGameToolServerOpen,
  IDBGameToolUser, 
  IDBGameToolPayment,
  IDBGameToolRecharge, 
  IDBGameToolItem,
  IDBGameToolComment,
  IDBGameToolLogAdmin,

  IDBGameChina, 
  IDBGameChinaUser, 
  IDBGameChinaPayment,
  IDBGameChinaComment,
  IDBGameChinaLogAdmin,

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
  IDBGamePrivateComment,
  IDBGamePrivateLogAdmin
} from './game'

export {
  IDBForumCategory, IDBForumCategorySub,
  IDBForumPost, IDBForumPostComment, IDBForumPostLike
} from './forum'

export { 
  IDBSocketOnline,
  IDBSocketChatGlobal, 
  IDBSocketChatSingle, IDBSocketChatSingleMessage,
  IDBSocketChatGuild
} from './socket'

export interface IGlobalDB {
  // Main DB
  Config: Model<IDBConfig>
  ConfigPermission: Model<IDBConfigPermission>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  AdsFrom: Model<IDBAdsFrom>

  User: Model<IDBUser>
  UserLevel: Model<IDBUserLevel>
  UserIP: Model<IDBUserIP>
  UserDevice: Model<IDBUserDevice>
  UserLogin: Model<IDBUserLogin>

  Invite: Model<IDBInvite>
  InviteReward: Model<IDBInviteReward>

  Guild: Model<IDBGuild>
  GuildLevel: Model<IDBGuildLevel>
  GuildRequest: Model<IDBGuildRequest>
  GuildMember: Model<IDBGuildMember>
  GuildDonate: Model<IDBGuildDonate>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>
  Spend: Model<IDBSpend>

  Voucher: Model<IDBVoucher>
  VoucherHistory: Model<IDBVoucherHistory>

  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>

  AdminIP: Model<IDBAdminIP>
  BlockIP: Model<IDBBlockIP>
  BlockDevice: Model<IDBBlockDevice>

  // Collab
  CollabLevel: Model<IDBCollabLevel>
  Collab: Model<IDBCollab>
  CollabNotify: Model<IDBCollabNotify>
  CollabIncome: Model<IDBCollabIncome>
  CollabWithdraw: Model<IDBCollabWithdraw>

  // Game DB
  GamePlatform: Model<IDBGamePlatform>
  GameCategory: Model<IDBGameCategory>

  GameTool: Model<IDBGameTool>
  GameToolNews: Model<IDBGameToolNews>
  GameToolServerOpen: Model<IDBGameToolServerOpen>
  GameToolUser: Model<IDBGameToolUser>
  GameToolPayment: Model<IDBGameToolPayment>
  GameToolRecharge: Model<IDBGameToolRecharge>
  GameToolItem: Model<IDBGameToolItem>
  GameToolComment: Model<IDBGameToolComment>
  GameToolLogAdmin: Model<IDBGameToolLogAdmin>

  GameChina: Model<IDBGameChina>
  GameChinaUser: Model<IDBGameChinaUser>
  GameChinaPayment: Model<IDBGameChinaPayment>
  GameChinaComment: Model<IDBGameChinaComment>
  GameChinaLogAdmin: Model<IDBGameChinaLogAdmin>

  GamePrivate: Model<IDBGamePrivate>
  GamePrivateNews: Model<IDBGamePrivateNews>
  GamePrivateServerOpen: Model<IDBGamePrivateServerOpen>
  GamePrivateUser: Model<IDBGamePrivateUser>
  GamePrivateUserLogin: Model<IDBGamePrivateUserLogin>
  GamePrivateRecharge: Model<IDBGamePrivateRecharge>
  GamePrivateRechargeHistory: Model<IDBGamePrivateRechargeHistory>
  GamePrivateItem: Model<IDBGamePrivateItem>
  GamePrivateItemBox: Model<IDBGamePrivateItemBox>
  GamePrivateShopItem: Model<IDBGamePrivateShopItem>
  GamePrivateShopItemHistory: Model<IDBGamePrivateShopItemHistory>
  GamePrivateShopPack: Model<IDBGamePrivateShopPack>
  GamePrivateShopPackHistory: Model<IDBGamePrivateShopPackHistory>
  GamePrivateGiftcode: Model<IDBGamePrivateGiftcode>
  GamePrivateGiftcodeHistory: Model<IDBGamePrivateGiftcodeHistory>
  GamePrivateEvent: Model<IDBGamePrivateEvent>
  GamePrivateEventHistory: Model<IDBGamePrivateEventHistory>
  GamePrivateComment: Model<IDBGamePrivateComment>
  GamePrivateLogAdmin: Model<IDBGamePrivateLogAdmin>

  // Forum DB
  ForumCategory: Model<IDBForumCategory>, 
  ForumCategorySub: Model<IDBForumCategorySub>, 
  ForumPost: Model<IDBForumPost>, 
  ForumPostComment: Model<IDBForumPostComment>, 
  ForumPostLike: Model<IDBForumPostLike>

  // Socket
  SocketOnline: Model<IDBSocketOnline>
  SocketChatGlobal: Model<IDBSocketChatGlobal>
  SocketChatSingle: Model<IDBSocketChatSingle>
  SocketChatSingleMessage: Model<IDBSocketChatSingleMessage>
  SocketChatGuild: Model<IDBSocketChatGuild>
}