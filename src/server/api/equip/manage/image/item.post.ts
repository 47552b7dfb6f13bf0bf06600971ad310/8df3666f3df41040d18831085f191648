import multer from 'multer'

const uploadImage = multer({ 
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      const filename = file.originalname
      const data = filename.split('.')[0].split('-')
      const type = data[0]
      const foldel = data[1]

      cb(null, `./assets/character/${type}/${foldel}`)
    },
    filename: function(req, file, cb) {
      const name = `item.png`
      cb(null, name)
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const acceptedTypes = file.mimetype.split('/')
    if(acceptedTypes[0] === 'image') cb(null, true)
    else cb(new Error('Chỉ hỗ trợ file hình ảnh'))
  }
})

export default defineEventHandler(async (event) => {
  try{
    // @ts-expect-error
    await callNodeListener(uploadImage.single('image'), event.node.req, event.node.res)
    return resp(event, { message: 'Tạo hình ảnh thành công' })
  } 
  catch (e:any) {
    return resp(event, { result: false })
  }
})