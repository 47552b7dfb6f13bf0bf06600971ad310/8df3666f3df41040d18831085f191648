import { createError, sendStream, getHeader } from 'h3'
import { createReadStream, existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event)

  const referer = getHeader(event, 'referer') || ''
  const allowedHost = runtimeConfig.public.clientURL
  if (!referer.startsWith(allowedHost)) {
    throw createError({ statusCode: 403, statusMessage: 'Không có quyền tải về tài nguyên' })
  }

  // @ts-expect-error
  const fileName = event.context.params.name
  const filePath = join(process.cwd(), 'assets/excel', fileName)

  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tài nguyên không tồn tại'
    })
  }
  
  setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`)
  return sendStream(event, createReadStream(filePath))
})

