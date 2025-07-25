import type { IAuth, IDBGamePrivate, IDBGamePrivateEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const data = await readBody(event)
    const { one, two, three, four, five, six, game : gameID } = data
    if(!gameID) throw 'Không tìm thấy ID trò chơi'
    if(!one || !two || !three || !four || !five || !six) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(one.price)) || parseInt(one.price) < 0
      || !!isNaN(parseInt(two.price)) || parseInt(two.price) < 0
      || !!isNaN(parseInt(three.price)) || parseInt(three.price) < 0
      || !!isNaN(parseInt(four.price)) || parseInt(four.price) < 0
      || !!isNaN(parseInt(five.price)) || parseInt(five.price) < 0
      || !!isNaN(parseInt(six.price)) || parseInt(six.price) < 0
    ) throw 'Dữ liệu đầu vào sai'

    const game = await DB.GamePrivate.findOne({ _id: gameID }).select('manager') as IDBGamePrivate
    if(!game) throw 'Trò chơi không tồn tại'
    await getAuthGM(event, auth, game)
    
    const config = await DB.GamePrivateEgg.findOne({ game: game._id }) as IDBGamePrivateEgg
    if(!config) throw 'Không tìm thấy cấu hình'

    const row = ['one', 'two', 'three', 'four', 'five', 'six']
    row.forEach(name => {
      // @ts-expect-error
      config[`${name}`] = {
        price: data[`${name}`].price,
        gift:  data[`${name}`].gift.map(({ item, amount, percent } : any) => ({ item: item._id, amount, percent }))
      }
    })

    // @ts-expect-error
    await config.save()
    logGameAdmin(event, 'private', game._id, `Sửa cấu hình <b>Đập Trứng</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})