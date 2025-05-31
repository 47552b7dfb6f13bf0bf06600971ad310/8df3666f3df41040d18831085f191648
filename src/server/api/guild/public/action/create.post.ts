import type { IAuth, IDBConfig, IDBGuild, IDBGuildLevel, IDBUser } from "~~/types"

function isRealNumber(value : any) {
  return typeof value === 'number' && isFinite(value);
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { name, request, description } = await readBody(event)
    if (!name) throw 'Không tìm thấy tên gia tộc'
    if (!!name.match(/\s/g)) throw 'Tên gia tộc không có khoảng cách'
    if (name.length < 2 || name.length > 4) throw 'Tên gia tộc trong khoảng 2-4 ký tự'
    if (!request) throw 'Dữ liệu đầu vào sai'
    if (!(typeof request.auto === 'boolean')) throw 'Dữ liệu tự động xét duyệt không hợp lệ'
    if(!isRealNumber(request.level)) throw 'Dữ liệu cấp độ gia nhập không hợp lệ'
    if (!request.level) throw 'Dữ liệu cấp độ gia nhập không hợp lệ'
    if (request.level < 1 || request.level > 15) throw 'Cấp độ gia nhập từ 1 đến 15'

    // Get Config
    const config = await DB.Config.findOne().select('guild') as IDBConfig
    if(!config) throw 'Hệ thống chưa sẵn sàng để tạo gia tộc'
    const price = config.guild.create

    // Get Guild Level
    const guildLevel = await DB.GuildLevel.findOne({ number: 1 }).select('_id') as IDBGuildLevel
    if(!guildLevel) throw 'Hệ thống chưa sẵn sàng để tạo gia tộc'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id })
    .select(profileSelect(['currency']).user) 
    .populate(profileSelect().level)
    .populate(profileSelect().guild) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin người dùng'
    if(!!user.guild) throw 'Bạn đã có gia tộc, không thể tạo'
    if(user.currency.coin < price) throw 'Không đủ xu để tạo gia tộc'

    // Get Guild By Name
    const guildCheck = await DB.Guild.findOne({ name: name.toLowerCase() }) as IDBGuild
    if(!!guildCheck) throw 'Tên gia tộc đã tồn tại'

    // Create
    const guild = await DB.Guild.create({
      name: name,
      description: description || '',
      level: guildLevel._id,
      request: {
        auto: request.auto,
        level: request.level
      },
      master: user._id
    })
    await DB.GuildMember.create({
      guild: guild._id,
      user: user._id,
      type: 100 // Master
    })

    // Update User
    await DB.User.updateOne({ _id: user._id }, { 
      guild: guild._id,
      $inc: { 'currency.coin': price * -1 }
    })

    // Log
    logUser({
      user: user._id,
      action: `Dùng <b>${price.toLocaleString("vi-VN")} Xu</b> để tạo gia tộc <b>${name}</b>`,
      type: 'guild.create',
    })

    // Notify Global
    IO.emit('notify-global-push', {
      user: user,
      content: `vừa tạo gia tộc <b>${name.toUpperCase()}</b>`
    })

    return resp(event, { result: guild })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})