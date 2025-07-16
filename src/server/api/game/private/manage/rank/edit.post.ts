import type { IAuth, IDBGamePrivate, IDBGamePrivateRank } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, server, end, active, game: gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id || !server || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const processEvent = await DB.GamePrivateRank.findOne({ _id: _id, game: game._id }).select('server send type') as IDBGamePrivateRank
    if(!processEvent) throw 'Tiến trình không tồn tại'

    if(processEvent.server != server){
      const getByServer = await DB.GamePrivateRank.findOne({ game: game._id, server: server, type: processEvent.type }).select('_id') as IDBGamePrivateRank
      if(!!getByServer) throw 'Tiến trình cho máy chủ này đã tồn tại'
    }

    const endDate = formatDate(end)
    if(!!active) {
      if(!!processEvent.send) throw 'Không thể kích hoạt khi hệ thống đã trả thưởng'
      const endOfToday = formatDate(event, new Date()).dayjs.endOf('date').unix()
      const endOfEvent = endDate.dayjs.endOf('date').unix()
      if(endOfToday > endOfEvent) throw 'Không thể kích hoạt khi thời gian kết thúc là quá khứ'
    }

    delete body['_id']
    delete body['game']
    await DB.GamePrivateRank.updateOne({ _id: processEvent._id }, {
      ...body,
      end: endDate.dayjs.hour(23).minute(0).second(0).millisecond(0)['$d'],
    })

    logGameAdmin(event, 'private', game._id, `Sửa tiến trình đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})