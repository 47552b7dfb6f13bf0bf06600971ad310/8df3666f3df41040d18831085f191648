import type { IAuth, IDBGamePrivate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { account, role_id, server_id, gift, title, content, game: code } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã trò chơi'
    if(!account || !role_id || !server_id || !gift) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ code: code }).select('_id ip api secret manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'
    await getAuthGM(event, auth, game)

    const giftItem = gift.map((i : any) => ({ id: i.item.item_id, amount: i.amount }))

    await gameSendMail(event, {
      url: game.api.mail,
      secret: game.secret,
      account: account,
      server_id: server_id,
      role_id: role_id,
      title: title || 'Quản Trị Viên',
      content: content || 'Thư gửi từ Quản Trị Viên',
      items: giftItem
    })

    return resp(event, { message: 'Gửi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})