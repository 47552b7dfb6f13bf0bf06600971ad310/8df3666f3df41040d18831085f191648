import type { IAuth, IDBConfig, IDBGuild, IDBGuildLevel, IDBUser } from "~~/types"

function isRealNumber(value : any) {
  return typeof value === 'number' && isFinite(value);
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(!auth.guild) throw 'Bạn chưa có gia tộc'

    const { request, description } = await readBody(event)
    if (description.length > 100) throw 'Giới thiệu không quá 100 ký tự'
    if (!request) throw 'Dữ liệu đầu vào sai'
    if (!(typeof request.active === 'boolean')) throw 'Dữ liệu nhận thành viên không hợp lệ'
    if (!(typeof request.auto === 'boolean')) throw 'Dữ liệu tự động xét duyệt không hợp lệ'
    if(!isRealNumber(request.level)) throw 'Dữ liệu cấp độ gia nhập không hợp lệ'
    if (!request.level) throw 'Dữ liệu cấp độ gia nhập không hợp lệ'
    if (request.level < 1 || request.level > 15) throw 'Cấp độ gia nhập từ 1 đến 15'

    // Get Guild
    const guild = await DB.Guild.findOne({ _id: auth.guild }).select('master') as IDBGuild
    if(!guild) throw 'Gia tộc không tồn tại'
    if(guild.master.toString() !== auth._id.toString()) throw 'Bạn không phải là người sáng lập gia tộc'

    // Update
    const guildUpdate = await DB.Guild.findOneAndUpdate({ _id: guild._id }, {
      description: description || '',
      request: {
        active: request.active,
        auto: request.auto,
        level: request.level
      }
    }, { new: true })
    
    return resp(event, { message: 'Cập nhật thành công', result: guildUpdate })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})