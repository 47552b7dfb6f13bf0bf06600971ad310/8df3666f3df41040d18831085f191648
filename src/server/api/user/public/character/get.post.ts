import type { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tài khoản'

    const user = await DB.User.findOne({ _id: _id })
    .select(`
      character.sex 
      character.body.use character.body.level
      character.wing.use character.wing.level
      character.weapon.use character.weapon.level
      character.pet.use character.pet.level
      character.circle.use character.circle.level
      character.title.use character.title.level
    `) 
    .populate({ path: 'character.body.use' }) 
    .populate({ path: 'character.wing.use' }) 
    .populate({ path: 'character.weapon.use' }) 
    .populate({ path: 'character.pet.use' }) 
    .populate({ path: 'character.circle.use' }) 
    .populate({ path: 'character.title.use' }) as IDBUser

    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    return resp(event, { result: user.character })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})