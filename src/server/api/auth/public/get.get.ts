import type { IAuth, IDBGuild, IDBUserLogin, IDBUser, IDBUserLevel, IDBUserStore } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    // Get User
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }).select('username level vip guild currency type') as IDBUser

    // Get Date
    const now  = new Date()
    const nowDate = formatDate(event, now)

    // User Login
    let createNewLogin = false
    const lastLogin = await DB.UserLogin.findOne({ user: user._id }).sort({ createdAt: -1 }).limit(1) as IDBUserLogin
    if(!lastLogin) createNewLogin = true
    else {
      const lastLoginDate = formatDate(event, lastLogin.createdAt)
      if(lastLoginDate.day != nowDate.day) createNewLogin = true
    }
    if(!!createNewLogin) await DB.UserLogin.create({ user: user._id })

    // User Level
    const realLevel = await DB.UserLevel.findOne({ 'exp': { $lte: user.currency.exp }}).select('title number').sort({ number: -1 }) as IDBUserLevel
    user.level = realLevel._id

    // User Guild
    const guild = await DB.Guild.findOne({ _id: user.guild }).select('name') as IDBGuild

    // User VIP
    if(!!user.vip.month.enable && !user.vip.forever.enable){
      const end = DayJS(user.vip.month.end).unix()
      const now = DayJS(Date.now()).unix()
      if(end < now){
        user.vip.month.enable = false
        user.vip.month.end = null
      }
    }

    // Save
    await user.save()

    // Result
    const userStore : IDBUserStore = {
      _id: user._id,
      username: user.username,
      type: user.type,
      currency: user.currency,
      level: realLevel,
      vip: user.vip,
      guild: guild
    }
    
    return resp(event, { result: userStore })
  } 
  catch (e:any) {
    return resp(event, { code: 401, message: e.toString() })
  }
})