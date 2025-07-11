import type { IAuth, IDBMission,  } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID nhiệm vụ'

    // Event
    const mission = await DB.Mission.findOne({ _id: _id }) as IDBMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'
    if(!mission.display) throw 'Nhiệm vụ đang bảo trì'

    // Check Expired
    if(mission.expired){
      const now = DayJS().unix()
      const expired = DayJS(mission.expired).unix()
      if(now > expired) throw 'Nhiệm vụ đã hết hạn để nhận'
    }

    // Check Active
    const active = await getMissionActive(event, mission)
    if(!active) throw 'Nhiệm vụ lỗi, vui lòng quay lại sau'
    if(active.status != 0) throw 'Bạn chưa đủ điều kiện để nhận'

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { $inc: { 'currency.ecoin': mission.ecoin } })

    // History
    await DB.MissionHistory.create({
      user: auth._id,
      mission: mission._id,
      type: mission.type,
      ecoin: mission.ecoin
    })

    // Log User
    logUser({
      user: auth._id,
      action: `Hoàn thành nhiệm vụ <b>${mission.name}</b> và nhận <b>${mission.ecoin.toLocaleString("vi-VN")}</b> ECoin`,
      type: 'mission.success',
      target: mission._id.toString()
    })

    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})