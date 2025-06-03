export default async (type: string, userType: number) => {
  const config = await DB.ConfigPermission.findOne().select(`${type}`)
  if(!config) throw 'Không tìm thấy thông tin quyền hạn'

  const typeArray = type.split('.')
  let permission : any = JSON.parse(JSON.stringify(config))

  typeArray.forEach(i => {
    if(!!permission[i]) permission = permission[i]
  })

  if(!permission.includes(userType)) throw 'Bạn không có quyền thao tác'
}