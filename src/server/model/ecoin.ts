import { Mongoose } from 'mongoose'
import type { IDBECoinShop, IDBECoinShopHistory } from '~~/types'

export const DBECoinShop = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBECoinShop>({ 
    name: { type: String },
    key: { type: String },
    image: { type: String },
    price: { type: Number, index: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })

  const model = mongoose.model('ECoinShop', schema, 'ECoinShop')
  return model 
}

export const DBECoinShopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBECoinShopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: 'ECoinShop', index: true },
    price: { type: Number, index: true },
    status: { type: Number, index: true, default: 0 },
    contact: {
      phone: { type: String },
      mail: { type: String },
    },
    bank: {
      name: { type: String },
      person: { type: String },
      number: { type: String },
    },
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
      time: { type: Date },
      reason: { type: String },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('ECoinShopHistory', schema, 'ECoinShopHistory')
  return model 
}