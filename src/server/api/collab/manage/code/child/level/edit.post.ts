import type { IAuth, IDBCollabLevel, IDBCollab } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { _id, commission, price, parent } = body
    if(!_id || !commission) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(price) || price < 0) throw 'Số tiền không hợp lệ'
    if(!commission.game) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      commission.vip < 0
      || commission.game.private < 0
      || commission.game.tool < 0
      || commission.game.china < 0
    ) throw 'Hoa hồng không hợp lệ'

    const collab = await DB.Collab.findOne({ code: parent }).select('user level') as IDBCollab
    if(!collab) throw 'Dữ liệu cộng tác viên không tồn tại'
    if(auth.type < 100 && collab.user.toString() != auth._id.toString()) throw 'Bạn không có quyền truy cập'
    if(!collab.level) throw 'Không lấy được dữ liệu cấp độ CTV của bạn'

    const levelParent = await DB.CollabLevel.findOne({ _id: collab.level }) as IDBCollabLevel
    if(!levelParent) throw 'Không lấy được dữ liệu cấp độ CTV của bạn'

    if(commission.vip > levelParent.commission.vip - 10) throw `Chiết khấu VIP không được vượt quá ${levelParent.commission.vip - 10}%`
    if(commission.game.private > levelParent.commission.game.private - 10) throw `Chiết khấu Game Private không được vượt quá ${levelParent.commission.game.private - 10}%`
    if(commission.game.tool > levelParent.commission.game.tool - 10) throw `Chiết khấu Game Tool không được vượt quá ${levelParent.commission.game.tool - 10}%`
    if(commission.game.china > levelParent.commission.game.china - 10) throw `Chiết khấu Game China không được vượt quá ${levelParent.commission.game.china - 10}%`
  
    const level = await DB.CollabLevel.findOne({ _id: _id, parent: collab._id }).select('number') as IDBCollabLevel
    if(!level) throw 'Cấp độ không tồn tại'

    delete body['_id']
    delete body['parent']
    await DB.CollabLevel.updateOne({ _id: level._id }, body)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})