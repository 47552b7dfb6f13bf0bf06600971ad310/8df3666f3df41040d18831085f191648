import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const user = await DB.User.findOne({ _id: auth._id }).select(`character`) as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // Merge Bag
    let bag : any = {
      body: user.character.body ? user.character.body.bag || [] : [],
      wing: user.character.wing ? user.character.wing.bag || [] : [],
      weapon: user.character.weapon ? user.character.weapon.bag || [] : [],
      pet: user.character.pet ? user.character.pet.bag || [] : [],
      circle: user.character.circle ? user.character.circle.bag || [] : [],
      title: user.character.title ? user.character.title.bag || [] : [],
    }
    bag = bag.body.concat(bag.wing, bag.weapon, bag.pet, bag.circle, bag.title)


    // Get All Equip in Bag
    let powers : any = { 
      body: { level: user.character.body.level || 0, power: 0 },
      wing: { level: user.character.wing.level || 0, power: 0 },
      weapon: { level: user.character.weapon.level || 0, power: 0 },
      circle: { level: user.character.circle.level || 0, power: 0 },
      pet: { level: user.character.pet.level || 0, power: 0 },
      title: { level: user.character.title.level || 0, power: 0 },
    }
    const equips = await DB.Equip.aggregate([
      { $match: { _id: { $in: bag }}},
      { $project: { type: 1, power: 1 }},
      { $group: { _id: '$type', power: { $sum: '$power' }}}
    ])
    equips.forEach((i : any) => powers[`${i._id}`]['power'] = i.power)

    return resp(event, { result: powers })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})