import type { IAuth, IDBCollab, IDBCollabLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const body = await readBody(event)
    const { number, commission, price, parent } = body
    if(!number || !commission) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!commission.game) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!isNumber(number) || number < 1) throw 'Cấp độ không hợp lệ'
    if(!isNumber(price) || price < 0) throw 'Số tiền không hợp lệ'
    if(
      commission.vip < 0
      || commission.game.private < 0
      || commission.game.tool < 0
      || commission.game.china < 0
    ) throw 'Hoa hồng không hợp lệ'

    if(!parent){
      await checkPermission('collab.level.add', auth.type)
      const getByNumber = await DB.CollabLevel.findOne({ number: number }).select('_id') as IDBCollabLevel
      if(!!getByNumber) throw 'Cấp độ đã tồn tại'

      delete body['parent']
      await DB.CollabLevel.create(body)
      logAdmin(event, `Thêm cấp độ cộng tác viên <b>${number}</b>`)
    }
    else {
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
    
      const getByNumber = await DB.CollabLevel.findOne({ number: number, parent: collab._id }).select('_id') as IDBCollabLevel
      if(!!getByNumber) throw 'Cấp độ đã tồn tại'

      body['parent'] = collab._id
      await DB.CollabLevel.create(body)
    }

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})