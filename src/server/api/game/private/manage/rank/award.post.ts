import type { IAuth, IDBGamePrivate, IDBGamePrivateRank } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { _id, award, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !award) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const processEvent = await DB.GamePrivateRank.findOne({ _id: _id, game: game._id }).select('server type') as IDBGamePrivateRank
    if(!processEvent) throw 'Tiến trình không tồn tại'

    const formatAward = award.map((i : any) => ({
      rank: i.rank,
      gift: i.gift.map((data : any) => ({
        item: data.item._id,
        amount: data.amount
      }))
    }))

    await DB.GamePrivateRank.updateOne({ _id: processEvent._id }, { award: formatAward })

    logGameAdmin(event, 'private', game._id, `Sửa phần thưởng đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})