import type { Types } from "mongoose"
import type { IAuth, IDBCollab, IDBMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id: missionID, collab : code, type } = await readBody(event)
    if(!type) throw 'Không tìm thấy kiểu hành động'
    if(!code) throw 'Không tìm thấy mã cộng tác viên'
     
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'

    if(type == 'toggle-single'){
      if(!missionID) throw 'Không tìm thấy ID trò chơi'
      const mission = await DB.Mission.findOne({ _id: missionID }).select('collab') as IDBMission
      const check = mission.collab.use.find((item: Types.ObjectId) => item.toString() == collab._id.toString())

      if(!check) await DB.Mission.updateOne({ _id: mission._id }, { $push: { 'collab.use': collab._id } })
      else await DB.Mission.updateOne({ _id: mission._id }, { $pull: { 'collab.use': collab._id } })
    }

    else if(type == 'add-all') {
      await DB.Mission.updateMany({ }, { $push: { 'collab.use': collab._id } })
    }

    else if(type == 'del-all') {
      await DB.Mission.updateMany({ }, { $pull: { 'collab.use': collab._id } })
    }

    else throw 'Kiểu hành động không hợp lệ'
      
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})