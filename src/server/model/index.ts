import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'

import { DBAdsFrom } from './ads'

import { DBUser, DBUserLevel, DBUserIP, DBUserDevice, DBUserLogin } from './user'

import { DBInvite, DBInviteReward } from './invite'

import { DBGuild, DBGuildLevel, DBGuildRequest, DBGuildMember, DBGuildDonate } from './guild'

import { DBGate } from './gate'
import { DBPayment } from './payment'
import { DBSpend } from './spend'

import { DBMission, DBMissionHistory } from './mission'

import { DBLogAdmin, DBLogUser } from './log'
import { DBAdminIP, DBBlockDevice, DBBlockIP } from './ip'

import { 
  DBCollabLevel,
  DBCollab,
  DBCollabNotify,
  DBCollabIncome,
  DBCollabWithdraw
} from './collab'

import {
  DBEcoinSeason,
  DBEcoinP2PBuy, DBEcoinP2PBuyHistory,
  DBEcoinP2PSell, DBEcoinP2PSellHistory
} from './ecoin'

import { 
  DBGamePlatform, 
  DBGameCategory, 

  DBGameTool, 
  DBGameToolNews,
  DBGameToolServerOpen,
  DBGameToolUser, 
  DBGameToolRecharge, 
  DBGameToolItem,
  DBGameToolComment,
  DBGameToolLogAdmin,

  DBGameChina, 
  DBGameChinaUser,
  DBGameToolPayment,
  DBGameChinaPayment,
  DBGameChinaComment,
  DBGameChinaLogAdmin,

  DBGamePrivate,
  DBGamePrivateNews,
  DBGamePrivateServerOpen,
  DBGamePrivateUser, DBGamePrivateUserLogin,
  DBGamePrivateRecharge, DBGamePrivateRechargeHistory,
  DBGamePrivateItem, DBGamePrivateItemBox,
  DBGamePrivateShopItem, DBGamePrivateShopItemHistory,
  DBGamePrivateShopPack, DBGamePrivateShopPackHistory,
  DBGamePrivateGiftcode, DBGamePrivateGiftcodeHistory,
  DBGamePrivateEvent, DBGamePrivateEventHistory,
  DBGamePrivateComment,
  DBGamePrivateLogAdmin
} from './game'

import {
  DBForumCategory, DBForumCategorySub,
  DBForumPost, DBForumPostComment, DBForumPostLike
} from './forum'

import { 
  DBSocketOnline,
  DBSocketChatGlobal, 
  DBSocketChatSingle, DBSocketChatSingleMessage,
  DBSocketChatGuild
} from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    // Main DB
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    AdsFrom: DBAdsFrom(mongoose),

    User: DBUser(mongoose),
    UserLevel: DBUserLevel(mongoose),
    UserIP: DBUserIP(mongoose),
    UserDevice: DBUserDevice(mongoose),
    UserLogin: DBUserLogin(mongoose),

    Invite: DBInvite(mongoose),
    InviteReward: DBInviteReward(mongoose),

    Guild: DBGuild(mongoose),
    GuildLevel: DBGuildLevel(mongoose),
    GuildRequest: DBGuildRequest(mongoose),
    GuildMember: DBGuildMember(mongoose),
    GuildDonate: DBGuildDonate(mongoose),

    Gate: DBGate(mongoose),
    Payment: DBPayment(mongoose),
    Spend: DBSpend(mongoose),

    Mission: DBMission(mongoose),
    MissionHistory: DBMissionHistory(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogUser: DBLogUser(mongoose),

    AdminIP: DBAdminIP(mongoose),
    BlockIP: DBBlockIP(mongoose),
    BlockDevice: DBBlockDevice(mongoose),

    // Collab
    CollabLevel: DBCollabLevel(mongoose),
    Collab: DBCollab(mongoose),
    CollabNotify: DBCollabNotify(mongoose),
    CollabIncome: DBCollabIncome(mongoose),
    CollabWithdraw: DBCollabWithdraw(mongoose),

    // Ecoin
    EcoinSeason: DBEcoinSeason(mongoose),
    EcoinP2PBuy: DBEcoinP2PBuy(mongoose),
    EcoinP2PBuyHistory: DBEcoinP2PBuyHistory(mongoose),
    EcoinP2PSell: DBEcoinP2PSell(mongoose),
    EcoinP2PSellHistory: DBEcoinP2PSellHistory(mongoose),

    // Game DB
    GamePlatform: DBGamePlatform(mongoose),
    GameCategory: DBGameCategory(mongoose),

    GameTool: DBGameTool(mongoose),
    GameToolNews: DBGameToolNews(mongoose),
    GameToolServerOpen: DBGameToolServerOpen(mongoose),
    GameToolUser: DBGameToolUser(mongoose),
    GameToolPayment: DBGameToolPayment(mongoose),
    GameToolRecharge: DBGameToolRecharge(mongoose),
    GameToolItem: DBGameToolItem(mongoose),
    GameToolComment: DBGameToolComment(mongoose),
    GameToolLogAdmin: DBGameToolLogAdmin(mongoose),

    GameChina: DBGameChina(mongoose),
    GameChinaUser: DBGameChinaUser(mongoose),
    GameChinaPayment: DBGameChinaPayment(mongoose),
    GameChinaComment: DBGameChinaComment(mongoose),
    GameChinaLogAdmin: DBGameChinaLogAdmin(mongoose),

    GamePrivate: DBGamePrivate(mongoose),
    GamePrivateNews: DBGamePrivateNews(mongoose),
    GamePrivateServerOpen: DBGamePrivateServerOpen(mongoose),
    GamePrivateUser: DBGamePrivateUser(mongoose),
    GamePrivateUserLogin: DBGamePrivateUserLogin(mongoose),
    GamePrivateRecharge: DBGamePrivateRecharge(mongoose),
    GamePrivateRechargeHistory: DBGamePrivateRechargeHistory(mongoose),
    GamePrivateItem: DBGamePrivateItem(mongoose),
    GamePrivateItemBox: DBGamePrivateItemBox(mongoose),
    GamePrivateShopItem: DBGamePrivateShopItem(mongoose),
    GamePrivateShopItemHistory: DBGamePrivateShopItemHistory(mongoose),
    GamePrivateShopPack: DBGamePrivateShopPack(mongoose),
    GamePrivateShopPackHistory: DBGamePrivateShopPackHistory(mongoose),
    GamePrivateGiftcode: DBGamePrivateGiftcode(mongoose),
    GamePrivateGiftcodeHistory: DBGamePrivateGiftcodeHistory(mongoose),
    GamePrivateEvent: DBGamePrivateEvent(mongoose),
    GamePrivateEventHistory: DBGamePrivateEventHistory(mongoose),
    GamePrivateComment: DBGamePrivateComment(mongoose),
    GamePrivateLogAdmin: DBGamePrivateLogAdmin(mongoose),

    // Forum DB
    ForumCategory: DBForumCategory(mongoose),
    ForumCategorySub: DBForumCategorySub(mongoose),
    
    ForumPost: DBForumPost(mongoose),
    ForumPostComment: DBForumPostComment(mongoose),
    ForumPostLike: DBForumPostLike(mongoose),

    // Socket
    SocketChatGlobal: DBSocketChatGlobal(mongoose),
    SocketOnline: DBSocketOnline(mongoose),
    SocketChatSingle: DBSocketChatSingle(mongoose),
    SocketChatSingleMessage: DBSocketChatSingleMessage(mongoose),
    SocketChatGuild: DBSocketChatGuild(mongoose)
  }
}