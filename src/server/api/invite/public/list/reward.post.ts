import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, invite, user } = await readBody(event)
    if(!invite) throw 'Không tìm thấy ID thông tin mời'
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const userCheck = (!!user && auth.type == 100) ? user : auth._id

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { invite: invite, from: userCheck }

    const list = await DB.InviteReward
    .find(match)
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)
    
    const total = await DB.InviteReward.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})