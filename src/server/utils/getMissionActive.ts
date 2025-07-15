import type { H3Event } from 'h3'
import type { IAuth, IDBLogUser, IDBMission, IDBMissionHistory, IDBUser, IDBUserLevel } from '~~/types'

const checkPayFirst = async (auth : IAuth, mission: IDBMission) => { 
  const log = await DB.LogUser.findOne({ user: auth._id, type: 'pay.first' }).select('target') as IDBLogUser
  if(!log) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  if(Number(log.target) < mission.need.payment.first) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

const checkPaySecond = async (auth : IAuth, mission: IDBMission) => {
  const log = await DB.LogUser.findOne({ user: auth._id, type: 'pay.second' }).select('target') as IDBLogUser
  if(!log) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  if(Number(log.target) < mission.need.payment.second) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

const checkPaySuccess = async (auth : IAuth, mission: IDBMission) => {
  const log = await DB.LogUser.findOne({ user: auth._id, type: 'pay.success' }).select('target').sort({ createdAt: -1 }) as IDBLogUser
  if(!log) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  if(Number(log.target) < mission.need.payment.second) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

const checkVIP = async (auth : IAuth, mission: IDBMission) => {
  const log = await DB.LogUser.findOne({ user: auth._id, type: 'vip.upgrade', target: mission.need.vip }).select('_id').sort({ createdAt: -1 }) as IDBLogUser
  if(!log) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

const checkLevel = async (auth : IAuth, mission: IDBMission) => {
  const user = await DB.User.findOne({ _id: auth._id }).select('level') as IDBUser
  if(!user) throw true
  const levelUser = await DB.UserLevel.findOne({ _id: user.level }).select('number') as IDBUserLevel
  if(!levelUser) throw true
  const levelCheck = await DB.UserLevel.findOne({ _id: mission.need.level }).select('number') as IDBUserLevel
  if(!levelCheck) throw true

  if(levelUser.number < levelCheck.number) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

const checkBuyGameTool = async (auth : IAuth, mission: IDBMission) => {
  const log = await DB.LogUser.findOne({ user: auth._id, type: 'game.tool.buy', target: mission.need.game.tool.source.toString() }).select('_id') as IDBLogUser
  if(!log) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt
  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

const checkPlayGamePrivate = async (auth : IAuth, mission: IDBMission) => {
  const log = await DB.LogUser.findOne({ user: auth._id, type: 'game.private.play', target: mission.need.game.private.source.toString() }).select('_id') as IDBLogUser
  if(!log) return Promise.resolve({ status: -1, color: 'gray', label: 'Chưa đạt' }) // Chưa đạt

  return Promise.resolve({ status: 0, color: 'primary', label: 'Nhận ngay' }) // Có thể nhận
}

export default async (event: H3Event, mission : IDBMission) : Promise<any> => {
  try {
    const auth = await getAuth(event, false) as IAuth
    if(!auth) return Promise.resolve({ status: -2, color: 'gray', label: 'Chưa đăng nhập' }) // Chưa đăng nhập

    const history = await DB.MissionHistory
    .findOne({ user: auth._id, mission: mission._id })
    .select('_id')
    .sort({ createdAt: -1 })
    .limit(1) as IDBMissionHistory
    if(!!history) return Promise.resolve({ status: 1, color: 'green', label: 'Đã hoàn thành' }) // Đã nhận

    if(mission.type == 'pay.first') return checkPayFirst(auth, mission)
    if(mission.type == 'pay.second') return checkPaySecond(auth, mission)
    if(mission.type == 'pay.success') return checkPaySuccess(auth, mission)
    if(mission.type == 'vip.upgrade') return checkVIP(auth, mission)
    if(mission.type == 'level.up') return checkLevel(auth, mission)
    if(mission.type == 'game.private.play') return checkPlayGamePrivate(auth, mission)
    if(mission.type == 'game.tool.buy') return checkBuyGameTool(auth, mission)

    throw true
  }
  catch (e:any) {
    return Promise.resolve({ status: 99, color: 'rose', label: 'Lỗi' }) // Lỗi không xác định
  }
}