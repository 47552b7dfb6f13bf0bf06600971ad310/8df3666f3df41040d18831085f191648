import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBAdsFrom, IDBCollab, IDBConfig, IDBUser, IDBUserLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, password, email, phone, invite : inviteCode } = await readBody(event)

    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 12) throw 'Tài khoản trong khoảng 6-12 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và chữ viết hoa'
    if (!(/^[a-z][a-z0-9]*$/g).test(username)) throw 'Bắt đầu phải bằng một chữ cái'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'

    if (!email) throw 'Vui lòng nhập Email'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'

    if (!phone) throw 'Vui lòng nhập số điện thoại'
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'

    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    // Get Config
    const config = await DB.Config.findOne().select('promo security') as IDBConfig
    if(!config) throw 'Hệ thống chưa sẵn sàng để đăng ký'

    // Check Visitor ID
    const visitorID = getCookie(event, 'visitor-id')
    if(!visitorID) throw 'Phát hiện đăng ký giả mạo'
    const countVisitor = await DB.UserDevice.count({ device: visitorID })
    if(countVisitor >= config.security.register.device) throw 'Thiết bị đã đạt giới hạn đăng ký'

    // Check IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    if(!IP) throw 'Phát hiện đăng ký giả mạo'
    const countIP = await DB.UserIP.count({ ip: IP })
    if(countIP >= config.security.register.ip) throw 'Địa chỉ IP đã đạt giới hạn đăng ký'

    // Get Level
    const level = await DB.UserLevel.findOne({ number: 1 }).select('_id') as IDBUserLevel
    if(!level) throw 'Hệ thống chưa sẵn sàng để đăng ký'

    // Check User
    const userCheck = await DB.User
    .findOne({ 
      $or: [
        { username: username },
        { phone: phone },
        { email: email }
      ]
    })
    .select('username email phone') as IDBUser
    
    if(!!userCheck){
      if(userCheck.username == username) throw 'Tài khoản đã tồn tại'
      if(userCheck.phone == phone) throw 'Số điện thoại đã tồn tại'
      if(userCheck.email == email) throw 'Địa chỉ Email đã tồn tại'
    }

    // Create
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      phone: phone,
      email: email,
      level: level._id,
      currency: {
        coin: config.promo.register.coin > 0 ? config.promo.register.coin : 0,
      }
    }) as IDBUser

    // Check Invite
    let inviteFrom = null
    if(!!inviteCode){
      const from = await DB.User
      .findOne({ 'invite.code' : inviteCode})
      .select('username level')
      .populate({ path: 'level', select: 'limit' }) as IDBUser
      if(!!from) {
        // Check Limit Invite
        const limit = (from.level as IDBUserLevel).limit.invite
        const countInvite = await DB.Invite.count({ from: from._id })
        if(countInvite >= limit) deleteCookie(event, 'invited-by', runtimeConfig.public.cookieConfig)
        else {
          await DB.Invite.create({ from: from._id, user: user._id })
          setCookie(event, 'invited-by', inviteCode, runtimeConfig.public.cookieConfig)
          logUser({
            user: from._id,
            action: `Mời thành công <b>${user.username}</b> tham gia bằng mã mời`,
            type: 'invite.add'
          })
          inviteFrom = from.username
        }
      }
      else deleteCookie(event, 'invited-by', runtimeConfig.public.cookieConfig)
    }

    // Update Ads From
    const adsFromCode = getCookie(event, 'ads-from')
    if(!!adsFromCode){
      const adsFromData = await DB.AdsFrom.findOne({ code: adsFromCode }).select('_id') as IDBAdsFrom
      if(!!adsFromData){
        await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'sign.up': 1 }})
        user.reg.from = adsFromData._id
      }
      else deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    }

    // Update Reg Collab
    const collabCode = runtimeConfig.public.collab
    if(!!collabCode){
      const collab = await DB.Collab.findOne({ code: collabCode }).select('_id') as IDBCollab
      collab && (user.reg.collab = collab._id)
    }

    // Make Token And Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })
    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    // Save Device
    await DB.UserDevice.create({ user: user._id, device: visitorID })

    // Save IP
    await DB.UserIP.create({ user: user._id, ip: IP })

    // Save Log
    logUser({
      user: user._id,
      action: !!inviteFrom ? `Đăng ký tài khoản bằng mã mời của <b>${inviteFrom}</b>` : 'Đăng ký tài khoản',
      type: 'signup'
    })
    if(config.promo.register.coin > 0) logUser({
      user: user._id,
      action: `Nhận <b>${config.promo.register.coin.toLocaleString('vi-VN')}</b> từ khuyến mãi đăng ký tài khoản mới`,
      type: 'promo.register.coin',
    })

    return resp(event, { result: true })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})