export default defineEventHandler(async (event) => {
  try {
    const list = await DB.UserLevel.find().select('title')
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})