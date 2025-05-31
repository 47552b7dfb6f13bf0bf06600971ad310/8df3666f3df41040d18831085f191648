import type { Mongoose } from 'mongoose'
import type { IDBAdminIP, IDBBlockDevice, IDBBlockIP } from '~~/types'

export const DBAdminIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdminIP>({ 
    ip: { type: String }
  })

  const model = mongoose.model('AdminIP', schema, 'AdminIP')
  return model 
}

export const DBBlockIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBBlockIP>({ 
    ip: { type: String }
  })

  const model = mongoose.model('BlockIP', schema, 'BlockIP')
  return model 
}

export const DBBlockDevice = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBBlockDevice>({ 
    device: { type: String }
  })

  const model = mongoose.model('BlockDevice', schema, 'BlockDevice')
  return model 
}

