import type { IAuth, IDBCollab, IDBNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, content, collab : code } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không đủ'
    if(!code) throw 'Dữ liệu đầu vào không đủ'
                
    const collab = await DB.Collab.findOne({ code: code }).select('code user') as IDBCollab
    if(!collab) throw 'Mã cộng tác viên không tồn tại'
    if(auth.type < 100 && (collab.user.toString() != auth._id.toString())) throw 'Bạn không có quyền truy cập'

    const news = await DB.News.findOne({ _id: _id, collab: collab._id }).select('title collab') as IDBNews
    if(!news) throw 'Tin tức không tồn tại'

    await DB.News.updateOne({ _id: _id },{ 
      content: content ? content : '', 
      updater: auth._id 
    })

    return resp(event, { message: 'Cập nhật nội dung thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})