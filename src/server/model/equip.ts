import { Types, type Mongoose } from 'mongoose'
import type { IDBEquip } from '~~/types'
// import configs from '../assets/character/config.json'


export const DBEquip = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEquip>({ 
    name: { type: String },
    description: { type: String },
    type: { type: String },
    sex: { type: Number },
    res: { type: String },
    power: { type: Number, default: 0, index: true },
    price: { type: Number, default: 0, index: true },
    offset: {
      info: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        scale: { type: Types.Decimal128 },
      },
      idle: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        scale: { type: Types.Decimal128 },
      },
      attack: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 },
        scale: { type: Types.Decimal128 },
      }
    },
    default: { type: Boolean, default: false }
  })

  schema.index({ name: 'text' })
  const model = mongoose.model('Equip', schema, 'Equip')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count > 0) return

    // await model.insertMany(configs)
  }

  autoCreate()

  return model 
}