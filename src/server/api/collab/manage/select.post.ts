import { IAuth, IDBCollab } from "~~/types"

const mergeArray = (input : Array<IDBCollab>, list : Array<IDBCollab>) => {
  const arr = input.concat(list)

  const merge = arr.reduce((a : Array<IDBCollab>, c : IDBCollab) => {
    const obj = a.find((obj : IDBCollab) => obj._id.toString() === c._id.toString())
    if(!obj) a.push(c)
    return a
  }, [])

  return merge
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type != 100) throw true
    
    const { key, _id } = await readBody(event)
    const match : any = {}

    if(!!key){
      const search = formatVNString(key, '-')
      match['$or'] = [
        { 'link': { $regex : search, $options : 'i' }},
        { 'code': { $regex : search, $options : 'i' }},
      ]
    }

    let list = await DB.Collab.find(match).select('code link').limit(10) as Array<IDBCollab>

    if(!!_id){
      const collab = await DB.Collab.findOne({ _id: _id }).select('code link') as IDBCollab
      const collabs = [ collab ]
      list = mergeArray(list, collabs)
    }

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})