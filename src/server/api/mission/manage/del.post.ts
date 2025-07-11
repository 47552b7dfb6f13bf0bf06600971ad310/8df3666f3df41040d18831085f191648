import type { IAuth, IDBMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('mission.del', auth.type)

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const mission = await DB.Mission.findOne({ _id: _id }).select('name') as IDBMission
    if(!mission) throw 'Nhiệm vụ này không tồn tại'

    await DB.MissionHistory.deleteMany({ mission: mission._id })
    await DB.Mission.deleteOne({ _id: mission._id })
    
    logAdmin(event, `Xóa nhiệm vụ <b>${mission.name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})