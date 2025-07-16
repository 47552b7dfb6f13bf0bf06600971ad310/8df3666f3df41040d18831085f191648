import type { IAuth, IDBGamePrivate, IDBGamePrivateRank } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, game: gameID } = await readBody(event)
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager ip api secret') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    if(!game.ip) throw 'Trò chơi đang bảo trì'
    await getAuthGM(event, auth, game)

    const processEvent = await DB.GamePrivateRank
    .findOne({ _id: _id, game: game._id })
    .select('server type award end')
    .populate({ path: 'award.gift.item', select: 'item_id type'}) as IDBGamePrivateRank
    if(!processEvent) throw 'Tiến trình không tồn tại'
    if(!!processEvent.send) throw 'Phần quà đã được trao'

    const typeInfo = {
      power: { text: 'lực chiến', title: 'Web TOP Power' },
      level: { text: 'cấp độ', title: 'Web TOP Level' }
    }[processEvent.type]

    const ranks = processEvent.type === 'power'
        ? await gameGetRankPower(event, { url: game.api.power, secret: game.secret, server_id: processEvent.server }, false)
        : await gameGetRankLevel(event, { url: game.api.level, secret: game.secret, server_id: processEvent.server }, false)

    for (const role of ranks) {
      try {
        if(role.rank > 10) throw `Xếp hạng [${role.rank}] không hợp lệ`
        if(role[`${processEvent.type}`] < 1) throw `Chỉ số xếp hạng [${role[`${processEvent.type}`]}] không hợp lệ`

        const awardFormat = JSON.parse(JSON.stringify(processEvent.award))
        const rankAward : any = awardFormat.find((award : any) => award.rank.toString() == role.rank.toString())
        if(!rankAward || (!!rankAward && rankAward.gift.length == 0)) throw `Phần quà cho hạng ${role.rank} chưa được thiết lập`

        // Send Gift
        const giftFormat = rankAward.gift.map((gift : any) => ({ id: gift.item.item_id, amount: gift.amount }))
        await gameSendMail(event, {
          url: game.api.mail,
          secret: game.secret,
          account: role.account,
          server_id: processEvent.server,
          role_id: role.role_id,
          title: `TOP ${role.rank} - ${typeInfo?.title}`,
          content: `Vật phẩm nhận từ sự kiện đua TOP ${typeInfo?.text} trên website`,
          items: giftFormat
        })

        // Log Process
        await DB.GamePrivateRankLog.create({
          game: game._id,
          process: processEvent._id,
          content: `✅ Trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${role.account}</b> với nhân vật <b>[${role.role_id}][${role.role_name}]</b>`
        })
      }
      catch (err : any) {
        await DB.GamePrivateRankLog.create({ 
          game: game._id,
          process: processEvent._id, 
          content: `❌ Lỗi trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${role.account}</b>: ${err.toString()}` 
        })
      }
    }

    // Update Process
    await DB.GamePrivateRank.updateOne({ _id: processEvent._id }, { send: true, active: false })
    await DB.GamePrivateRankLog.create({ game: game._id, process: processEvent._id, content: `Trả thưởng đua TOP thành công` })

    logGameAdmin(event, 'private', game._id, `Trả quà đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> sớm cho máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})