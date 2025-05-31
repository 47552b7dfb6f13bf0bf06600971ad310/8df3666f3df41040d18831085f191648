import type { IAuth, IDBGuild, IDBGuildLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { coin } = await readBody(event)
    if(!coin) throw 'Không tìm thấy thông tin xu cống hiến'
    if(!isNumber(coin) || parseInt(coin) < 1) throw 'Số xu không hợp lệ'
    if(coin > 100000000) throw 'Số lượng không vượt quá 100 triệu xu'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('guild currency') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(!user.guild) throw 'Bạn chưa có gia tộc nào'
    if(user.currency.coin < coin) throw 'Số dư xu không đủ'

    // Get Guild
    const guild = await DB.Guild.findOne({ _id: user.guild }).select('name level master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'

    // Update Guild
    await DB.User.updateOne({ _id: user._id }, { $inc: { 'currency.coin': coin * -1 }})
    await DB.GuildMember.updateOne({ user: user._id }, { $inc: { 'donate': coin }})
    await DB.GuildDonate.create({ guild: guild._id, user: user._id, coin: coin })
    const updateGuild = await DB.Guild.findOneAndUpdate({ _id: guild._id }, { $inc: { 'currency.exp': coin }}, { new: true }) as IDBGuild

    // Update Level
    const realLevel = await DB.GuildLevel.findOne({ 'exp': { $lte: updateGuild.currency.exp }}).sort({ number: -1 }) as IDBGuildLevel
    if(realLevel._id.toString() != guild.level.toString()){
      // @ts-expect-error
      guild.level = realLevel._id, await guild.save()

      const master = await DB.User.findOne({ _id: guild.master })
      .select(profileSelect().user)
      .populate(profileSelect().level)
      .populate(profileSelect().guild) as IDBUser

      IO.emit('notify-global-push', {
        user: master,
        content: `gia tộc <b>${guild.name.toUpperCase()}</b> của tại hạ vừa đạt cấp <b>${realLevel.number}</b>`
      })
    }
    
    
    // Log
    logUser({
      user: user._id,
      action: `Dùng <b>${coin.toLocaleString("vi-VN")} Xu</b> để cống hiến cho gia tộc <b>${guild.name}</b> của mình`,
      type: 'guild.donate',
      target: coin
    })

    return resp(event, { message: 'Cống hiến thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})