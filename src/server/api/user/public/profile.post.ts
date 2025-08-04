import type { IAuth, IDBCollab, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tài khoản'

    const auth = await getAuth(event, false) as IAuth | null
    let select : any

    if(!auth) select = '-password -email -phone -character -vouchers -statistic -invite -token -otp'
    if(!!auth){
      if(auth.type == 100) select = '-character -vouchers -password -token -otp'
      else
        if(auth._id.toString() == _id.toString()) select = '-character -vouchers -statistic -china -password -token -otp'
        else select = '-character -vouchers -statistic -china -password -email -phone -invite -token -otp'
    }
    
    const data = await DB.User
    .findOne({ _id: _id })
    .populate(profileSelect().level)
    .populate(profileSelect().guild)
    .select(select) as IDBUser
    if(!data) throw 'Không tìm thấy thông tin tài khoản'
    const user = JSON.parse(JSON.stringify(data))

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