import type { IAuth, IDBGamePrivate, IDBGamePrivateItem } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { item, amount, percent, game : gameID } = body
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!item) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(!!isNaN(parseFloat(percent)) || (parseFloat(percent) * -1) > 0) throw 'Tỷ lệ không hợp lệ'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)

    const itemData = await DB.GamePrivateItem.findOne({ _id: item, game: game._id }).select('item_name') as IDBGamePrivateItem
    if(!itemData) throw 'Vật phẩm không tồn tại'

    await DB.GamePrivateWheel.create({
      ...body,
      item: itemData._id,
      game: game._id
    })

    logGameAdmin(event, 'private', game._id, `Thêm vật phẩm <b>${itemData.item_name}</b> vào vòng quay`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})