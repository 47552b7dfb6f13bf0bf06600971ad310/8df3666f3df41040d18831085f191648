import { createError, sendStream } from 'h3'
import { createReadStream, existsSync, statSync } from 'fs'
import { join, normalize } from 'path'

export default defineEventHandler(async (event) => {
  const pathParam = event.context.params?.path
  const pathParts = Array.isArray(pathParam) ? pathParam : [pathParam]

  const safePath = normalize(join(...pathParts))
  if (safePath.includes('..')) {
    throw createError({ statusCode: 400, statusMessage: 'Đường dẫn không hợp lệ' })
  }

  const filePath = join(process.cwd(), 'assets/character', ...pathParts)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    throw createError({ statusCode: 404, statusMessage: 'Tài nguyên không tồn tại' })
  }

  return sendStream(event, createReadStream(filePath))
})

