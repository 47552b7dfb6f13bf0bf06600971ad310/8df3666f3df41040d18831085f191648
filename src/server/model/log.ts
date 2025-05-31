import type { Mongoose } from 'mongoose'
import type { IDBLogAdmin, IDBLogUser } from '~~/types'

export const DBLogAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogAdmin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogAdmin', schema, 'LogAdmin')
  return model
}

export const DBLogUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLogUser>({ 
    type: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String },
    target: { type: String },
    watched: { type: Boolean, default: false }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LogUser', schema, 'LogUser')
  return model
}

