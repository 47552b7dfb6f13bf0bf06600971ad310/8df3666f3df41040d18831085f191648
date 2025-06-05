export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Equip.find({ default: true })
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})