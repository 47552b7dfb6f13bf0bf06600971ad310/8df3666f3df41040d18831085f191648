import type { IAuth } from "~~/types"
import { join } from 'path'
import { writeFileSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission('equip.edit', auth.type)

    const createdAt = formatDate(event, new Date())
    const filename = `json-equips-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.json`
    const filePath = join('assets/json', filename)

    const equip = await DB.Equip.find().select('-_id')
    const data = JSON.parse(JSON.stringify(equip))
    delete data['_id']

    data.forEach((item : any) => {
      ["info", "idle", "attack"].forEach(state => {
        const scaleObj = item.offset[state].scale;
        if (scaleObj && typeof scaleObj["$numberDecimal"] === "string") {
          item.offset[state].scale = parseFloat(scaleObj["$numberDecimal"]);
        }
      })
    })

    writeFileSync(filePath, JSON.stringify(data, null, 2))
    return resp(event, { result: { url: `/json/${filename}`, name: filename }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})