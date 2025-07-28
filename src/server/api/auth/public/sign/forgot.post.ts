import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const { username, email, otp, password } = await readBody(event)
    if(!username || !email || !otp || !password) throw 'Vui lòng nhập đủ thông tin'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'

    // Check User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('email block type otp') as IDBUser
    if(!user) throw 'Tài khoản không khả dụng'
    if(!!user.block) throw 'Tài khoản không khả dụng'
    if(user.type > 0) throw 'Tài khoản không khả dụng'
    if(!user.email) throw 'Tài khoản không khả dụng'
    if(user.email != email) throw 'Thông tin không hợp lệ'

    // Kiểm tra OTP
    if (!user.otp || user.otp.code != otp) throw 'Mã xác minh không chính xác'
    if (new Date(user.otp.expired) < new Date()) throw 'Mã xác minh đã hết hạn'

    // Update and Log out all
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.password = md5(password)
    user.token = token
    user.otp.code = ''
    await user.save()

    // Save Log
    const IP = getRequestIP(event, { xForwardedFor: true })
    logUser({
      user: user._id,
      action: `Thao tác lấy lại <b>mật khẩu</b> tài khoản bằng IP <b>${IP}</b>`,
      type: 'auth.forgot'
    })

    return resp(event, { message: 'Lấy lại mật khẩu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})