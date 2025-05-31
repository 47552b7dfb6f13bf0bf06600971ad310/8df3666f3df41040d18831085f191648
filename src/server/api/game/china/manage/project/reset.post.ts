import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw 'Bạn không phải quản trị viên cấp cao'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const game = await DB.GameChina.findOne({ _id: _id }).select('name') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'

    await DB.GameChinaUser.deleteMany({ game: game._id })
    await DB.GameChinaPayment.deleteMany({ game: game._id })
    await DB.GameChinaComment.deleteMany({ game: game._id })
    await DB.GameChinaLogAdmin.deleteMany({ game: game._id })
    await DB.GameChina.updateOne({ _id: game._id },{
      statistic: { play: 0, view: 0, user: 0, revenue: 0 },
      rate: { pay: '3.0' }
    })

    logGameAdmin(event, 'china', game._id, `Reset trò chơi`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})