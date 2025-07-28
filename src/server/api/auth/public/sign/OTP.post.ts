import nodemailer from 'nodemailer'
import type { IDBUser, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { username, email } = await readBody(event)
    if(!username || !email) throw 'Vui lòng nhập đủ thông tin'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'

    // Get Config
    const config = await DB.Config.findOne().select('google') as IDBConfig
    if(!config) throw 'Hệ thống chưa sẵn sàng để xử lý'
    if(!config.google.mail_send_info || !config.google.mail_send_secret) throw 'Hệ thống chưa sẵn sàng để xử lý'

    // Check User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('email block type otp') as IDBUser
    if(!user) throw 'Tài khoản không khả dụng'
    if(!!user.block) throw 'Tài khoản không khả dụng'
    if(user.type > 0) throw 'Tài khoản không khả dụng'
    if(!user.email) throw 'Tài khoản không khả dụng'
    if(user.email != email) throw 'Thông tin không hợp lệ'
    if(!!user.otp && !!user.otp.expired && !!user.otp.code){
      if (new Date(user.otp.expired) > new Date()) throw 'Bạn đang có mã xác minh đang khả dụng, vui lòng thử lại sau'
    }

    // Make OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = {
      code: otp,
      expired: new Date(Date.now() + 5 * 60 * 1000) // 5 phút
    }
    await user.save()

    // Send mail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.google.mail_send_info,
        pass: config.google.mail_send_secret
      }
    })

    await transporter.sendMail({
      from: `"ENI Studio" <${config.google.mail_send_info}>`,
      to: user.email,
      subject: 'Mã xác nhận đặt lại mật khẩu',
      html: `<p>Mã xác nhận của bạn là: <b>${otp}</b></p><p>Mã có hiệu lực trong 5 phút.</p>`
    })

    return resp(event, { message: 'Mã xác nhận đã được gửi đến Email của bạn' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})