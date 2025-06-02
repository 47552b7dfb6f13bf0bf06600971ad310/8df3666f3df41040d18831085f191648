import type { IAuth, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    
    const user = await DB.User.findOne({ _id: auth._id }).select('invite level') as IDBUser
    if(!user) return 'Tài khoản không tồn tại'

    const level = await DB.UserLevel
    .findOne({ _id: user.level })
    .select('voucher.friend limit.invite gift.invite bonus.invite.payment')
    .populate({ path: 'voucher.friend', select: 'title' }) as IDBUserLevel
    if(!level) throw 'Không tìm thấy cấp độ tài khoản'

    let code : string

    if(!!user.invite.code) code = user.invite.code
    else {
      code = await makeCodeInvite(10)
      await DB.User.updateOne({ _id: user._id }, { 'invite.code': code })
    }

    return resp(event, { result: { code, level } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})