
interface IData {
  user: string,
  userObj: any,
  populate: Array<any>
  level: any,
  levelObj: any,
  guild: any,
  guildObj: any,
  guildLevelObj: any
}

export default (more? : Array<string>) : IData =>  {
  let listUser = [
    'username', 'avatar', 'type', 'level', 'vip', 'guild', 'online'
  ]
  let listUserLevel = [
    'title', 'number', 'exp'
  ]
  let listUserGuild = [
    'name', 'level', 'master'
  ]
  let listUserGuildLevel = [
    'number', 'exp'
  ]

  const mergedUser = more ? listUser.concat(more) : listUser

  const level = { path: 'level', select: listUserLevel.join(' ') }
  const guild = { path: 'guild', select: listUserGuild.join(' '), populate: { path: 'level', select: listUserGuildLevel.join(' ') } }

  return {
    user: mergedUser.join(' '),
    userObj: Object.fromEntries(mergedUser.map(key => [key, 1])),
    populate: [ level, guild ],
    level: level,
    levelObj: Object.fromEntries(listUserLevel.map(key => [key, 1])),
    guild: guild,
    guildObj: Object.fromEntries(listUserGuild.map(key => [key, 1])),
    guildLevelObj: Object.fromEntries(listUserGuildLevel.map(key => [key, 1])),
  }
}