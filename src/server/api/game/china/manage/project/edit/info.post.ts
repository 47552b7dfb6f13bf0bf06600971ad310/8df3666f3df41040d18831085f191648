import type { IAuth, IDBGameChina } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id : gameID, platform, category, name, code, description } = body
    if(!gameID) throw 'Không tìm thấy mã trò chơi'
    if(!platform || !category || !name || !code || !description) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const game = await DB.GameChina.findOne({ _id: gameID }).select('name code manager') as IDBGameChina
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const platformCheck = await DB.GamePlatform.findOne({ _id: platform }).select('_id')
    if(!platformCheck) throw 'Nền tảng không tồn tại'

    const categoryCheck = await DB.GameCategory.findOne({ _id: category }).select('_id')
    if(!categoryCheck) throw 'Thể loại không tồn tại'

    if(game.name != name){
      const key = formatVNString(name, '-')
      const getByKey = await DB.GameChina.findOne({ key: key }).select('_id')
      if(!!getByKey) throw 'Tên trò chơi đã tồn tại'
      body.key = key
    }

    if(game.code != code){
      const getByCode = await DB.GameChina.findOne({ code: code }).select('_id')
      if(!!getByCode) throw 'Mã trò chơi đã tồn tại'
    }

    delete body['_id']
    await DB.GameChina.updateOne({ _id: game._id }, body)

    logGameAdmin(event, 'china', game._id, `Sửa thông tin trò chơi`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})