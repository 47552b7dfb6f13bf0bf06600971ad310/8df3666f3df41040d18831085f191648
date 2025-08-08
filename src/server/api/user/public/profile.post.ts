import type { IAuth, IDBCollab, IDBInvite, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id, collab : code } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tài khoản'

    const auth = await getAuth(event, false) as IAuth | null
    let select : any

    if(!auth) select = '-character -vouchers -statistic -china -password -email -phone -invite -token -otp'
    else {
      if(!!code){
        const collab = await DB.Collab.findOne({ code: code }).select('user') as IDBCollab
        if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
        if(
          auth.type < 100 
          && collab.user.toString() != auth._id.toString()
        ) select = '-character -vouchers -statistic -china -password -email -phone -invite -token -otp'
        else select = '-character -vouchers -statistic -china -password -token -otp'
      }
      else {
        if(auth.type == 100) select = '-character -vouchers -statistic -china -password -token -otp'
        else
          if(auth._id.toString() == _id.toString()) select = '-character -vouchers -statistic -china -password -token -otp'
          else select = '-character -vouchers -statistic -china -password -email -phone -invite -token -otp'
      }
    }
    
    const data = await DB.User
    .findOne({ _id: _id })
    .populate(profileSelect().level)
    .populate(profileSelect().guild)
    .select(select) as IDBUser
    if(!data) throw 'Không tìm thấy thông tin tài khoản'
    const user = JSON.parse(JSON.stringify(data))

    //  Inviter
    const inviter = await DB.Invite
    .findOne({ user: data._id })
    .select('from')
    .populate({ path: 'from', select: 'username' }) as IDBInvite
    if(!!inviter) user.inviter = inviter.from

    // Next Level
    if(!!user.level){
      const level = user.level as IDBUserLevel
      const collabUser = user.reg.collab
      const matchLevel : any = { number: level.number + 1 }
      if(!!collabUser){
        const collab = await DB.Collab.findOne({ _id: collabUser }).select('privilege') as IDBCollab
        if(!!collab && !!collab.privilege.edit_level) matchLevel['collab'] = collab._id
        else matchLevel['$or'] =  [{ collab: { $exists: false } }, { collab: null }]
      }
      else matchLevel['$or'] =  [{ collab: { $exists: false } }, { collab: null }]

      const next = await DB.UserLevel.findOne(matchLevel).select('title number exp') as IDBUserLevel
      if(!!next) user.level.next = next
    }

    // Hidden Phone
    if(!!auth && auth.type != 100 && !!user.phone){
      const fullNumber = user.phone
      const last4Digits = fullNumber.slice(-2)
      const maskedNumber = last4Digits.padStart(fullNumber.length, '*')
      user.phone = maskedNumber
    }

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})