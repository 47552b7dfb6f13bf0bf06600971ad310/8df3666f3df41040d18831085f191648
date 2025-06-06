import type { IAuth, IDBSocketChatSingle } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { _id, size, skip } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID cuộc trò chuyện'

    const conversation = await DB.SocketChatSingle.findOne({ _id: _id })
    .populate({ 
      path: 'from', 
      select: profileSelect(['currency']).user,
      populate: profileSelect().populate,
    })
    .populate({ 
      path: 'to', 
      select: profileSelect(['currency']).user,
      populate: profileSelect().populate,
    }) as IDBSocketChatSingle

    if(!conversation) throw 'Cuộc trò chuyện không tồn tại' 
    if(
      auth.type < 100
      && conversation.from._id.toString() != auth._id.toString()
      && conversation.to._id.toString() != auth._id.toString()
    ) throw 'Bạn không có quyền truy cập cuộc trò chuyện'

    const messages = await DB.SocketChatSingleMessage
    .find({ conversation: conversation._id })
    .sort({ createdAt: -1 })
    .limit(size)
    .skip(skip)

    return resp(event, { result: { conversation, messages } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})