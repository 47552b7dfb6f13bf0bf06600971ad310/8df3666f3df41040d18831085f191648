import type { IAuth } from "~~/types"
import { join } from 'path'
import { writeFileSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const equip = await DB.Equip.find().select('-_id')
    const createdAt = formatDate(event, new Date())
    const filename = `configs.json`
    const filePath = join('assets/character', filename)

    const data = JSON.parse(JSON.stringify(equip))
    delete data['_id']
    writeFileSync(filePath, JSON.stringify(data, null, 2))

    return resp(event, { result: { url: `/character/${filename}`, name: filename }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})