import type { IAuth } from "~~/types"
import { join } from 'path'
import { writeFileSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const equip = await DB.Equip.find().select('-_id')
    const createdAt = formatDate(event, new Date())
    const filename = `json-equip-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.json`
    const filePath = join('dist/json', filename)

    const data = JSON.parse(JSON.stringify(equip))
    delete data['_id']
    writeFileSync(filePath, JSON.stringify(data, null, 2))

    return resp(event, { result: { url: `/json/${filename}`, name: filename }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})