import { createError, sendStream, getHeader } from 'h3'
import { createReadStream, existsSync, statSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)
  const pathParam = event.context.params?.path
  const pathParts = Array.isArray(pathParam) ? pathParam : [pathParam]

  const referer = getHeader(event, 'referer') || ''
  const allowedHost = runtimeConfig.public.clientURL
  if (!referer.startsWith(allowedHost)) {
    throw createError({ statusCode: 403, statusMessage: 'Không có quyền tải về tài nguyên' })
  }

  const filePath = join(process.cwd(), 'assets/images', ...pathParts)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    throw createError({ statusCode: 404, statusMessage: 'Tài nguyên không tồn tại' })
  }

  return sendStream(event, createReadStream(filePath))
})

