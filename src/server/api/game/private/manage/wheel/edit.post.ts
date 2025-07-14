import type { IAuth, IDBGamePrivate, IDBGamePrivateItem, IDBGamePrivateWheel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, amount, percent, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!_id ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(!!isNaN(parseFloat(percent)) || (parseFloat(percent) * -1) > 0) throw 'Tỷ lệ không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const wheelItem = await DB.GamePrivateWheel.findOne({ _id: _id, game: game._id }).select('item') as IDBGamePrivateWheel
    if(!wheelItem) throw 'Vật phẩm vòng quay không tồn tại'

    const itemData = await DB.GamePrivateItem.findOne({ _id: wheelItem.item, game: game._id }).select('item_name') as IDBGamePrivateItem
    if(!itemData) throw 'Vật phẩm không tồn tại'

    delete body['_id']
    delete body['game']
    await DB.GamePrivateWheel.updateOne({ _id: wheelItem._id }, body)
    
    logGameAdmin(event, 'private', game._id, `Sửa thông tin vật phẩm <b>${itemData.item_name}</b> ở vòng quay`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})