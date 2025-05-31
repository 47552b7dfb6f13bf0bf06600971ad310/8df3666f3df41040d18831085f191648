export default defineEventHandler(async (event) => {
  try {
    const { size, skip } = await readBody(event)

    const list = await DB.SocketChatGlobal
    .find({})
    .populate({ 
      path: 'user', 
      select: profileSelect(['currency']).user,
      populate: profileSelect().populate,
    })
    .sort({ createdAt: -1 })
    .limit(size)
    .skip(skip)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})