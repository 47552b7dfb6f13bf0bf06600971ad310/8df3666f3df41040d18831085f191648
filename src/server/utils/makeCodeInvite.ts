export default async (length : number = 8) : Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  while (true) {
    const code = Array.from({ length })
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('')

    const exists = await DB.User.findOne({ 'invite.code' : code }).select('_id')
    if (!exists) return code
  }
}