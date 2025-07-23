import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const body = await readBody(event)

    // User
    if(!!body.del_user) {
      await DB.User.deleteMany({ type: { $lt: 99 } })
      await DB.UserIP.deleteMany({})
      await DB.UserDevice.deleteMany({})
      await DB.UserLogin.deleteMany({})
    }
    await DB.User.updateMany({}, {
      reg: { from: null, collab: null, platform: null },
      invite: { code: null, friend: 0 },
      currency: { exp: 0, coin: 0, ecoin: 0, lcoin: 0 },
      vip: {
        month: { enable: false, end: null },
        forever: { enable: false, end: null }
      },
      character: {
        body: { bag: [], use: null, level: 0 },
        wing: { bag: [], use: null, level: 0 },
        weapon: { bag: [], use: null, level: 0 },
        pet: { bag: [], use: null, level: 0 },
        circle: { bag: [], use: null, level: 0 },
        title: { bag: [], use: null, level: 0 },
      },
      level: null,
      guild: null,
      token: null,
      statistic: { pay: 0 },
      vouchers: []
    })

    // Ads
    await DB.AdsFrom.deleteMany({})

    // Collab
    if(!!body.del_collab){
      await DB.Collab.deleteMany({})
      await DB.CollabNotify.deleteMany({})
      await DB.CollabIncome.deleteMany({})
      await DB.CollabWithdraw.deleteMany({})
    }

    // Forum
    if(!!body.del_forum){
      await DB.ForumPost.deleteMany({})
      await DB.ForumPostLike.deleteMany({})
      await DB.ForumPostComment.deleteMany({})
    }

    // Guild
    await DB.Guild.deleteMany({})
    await DB.GuildRequest.deleteMany({})
    await DB.GuildMember.deleteMany({})
    await DB.GuildDonate.deleteMany({})

    // Invite
    await DB.Invite.deleteMany({})
    await DB.InviteReward.deleteMany({})

    // Log
    await DB.LogAdmin.deleteMany({})
    await DB.LogUser.deleteMany({})

    // News
    if(!!body.del_news) await DB.News.deleteMany({})

    // Payment
    if(!!body.del_payment) await DB.Payment.deleteMany({})

    // Socket
    await DB.SocketOnline.deleteMany({})
    await DB.SocketChatGlobal.deleteMany({})
    await DB.SocketChatSingle.deleteMany({})
    await DB.SocketChatSingleMessage.deleteMany({})
    await DB.SocketChatGuild.deleteMany({})

    // Spend
    await DB.Spend.deleteMany({})

    // Voucher
    await DB.VoucherHistory.deleteMany({})

    // Mission
    await DB.MissionHistory.deleteMany({})

    // Game Private
    await DB.GamePrivateNews.deleteMany({})
    await DB.GamePrivateServerOpen.deleteMany({})
    await DB.GamePrivateUser.deleteMany({})
    await DB.GamePrivateUserLogin.deleteMany({})
    await DB.GamePrivateRechargeHistory.deleteMany({})
    await DB.GamePrivateShopItemHistory.deleteMany({})
    await DB.GamePrivateShopPackHistory.deleteMany({})
    await DB.GamePrivateEventHistory.deleteMany({})
    await DB.GamePrivateGiftcodeHistory.deleteMany({})
    await DB.GamePrivateEggHistory.deleteMany({})
    await DB.GamePrivateWheelHistory.deleteMany({})
    await DB.GamePrivateRankLog.deleteMany({})
    await DB.GamePrivateComment.deleteMany({})
    await DB.GamePrivateLogAdmin.deleteMany({})
    await DB.GamePrivate.updateMany({},{
      statistic: { play: 0, view: 0, user: 0, revenue: 0 },
      collab: { use: [], commission: 5 },
      manager: [],
      rate: {
        shop: {
          default: 5,
          limit: { number: 0, expired: null },
          vip: { month: 2, forever: 15 },
        }
      }
    })

    // Game Tool
    await DB.GameToolNews.deleteMany({})
    await DB.GameToolServerOpen.deleteMany({})
    await DB.GameToolUser.deleteMany({})
    await DB.GameToolPayment.deleteMany({})
    await DB.GameToolComment.deleteMany({})
    await DB.GameToolLogAdmin.deleteMany({})
    await DB.GameTool.updateMany({},{
      statistic: { play: 0, view: 0, user: 0, revenue: 0 },
      collab: { use: [], commission: 5 },
      manager: [],
      price: { recharge: 50000, mail: 50000 },
      discount: {
        vip: { month: 2, forever: 100 }
      }
    })

    // Game China
    await DB.GameChinaUser.deleteMany({})
    await DB.GameChinaPayment.deleteMany({})
    await DB.GameChinaComment.deleteMany({})
    await DB.GameChinaLogAdmin.deleteMany({})
    await DB.GameChina.updateMany({ },{
      statistic: { play: 0, view: 0, user: 0, revenue: 0 },
      collab: { use: [] },
      manager: [],
      rate: { pay: '3.0' }
    })

    IO.emit('web-update')
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})