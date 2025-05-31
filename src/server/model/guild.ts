import type { Mongoose } from 'mongoose'
import type { IDBGuild, IDBGuildRequest, IDBGuildLevel, IDBGuildMember, IDBGuildDonate } from '~~/types'

export const DBGuildLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGuildLevel>({ 
    number: { type: Number, default: 1, index: true },
    exp: { type: Number, default: 0, index: true },
    bonus: {
      payment: { type: Number, default: 0, index: true }
    },
    limit: {
      member: { type: Number, default: 0, index: true }
    }
  })

  const model = mongoose.model('GuildLevel', schema, 'GuildLevel')

  const autoCreate = async () => {
    const lv1 = await model.count({ number: 1 })
    const lv2 = await model.count({ number: 2 })
    const lv3 = await model.count({ number: 3 })
    const lv4 = await model.count({ number: 4 })
    const lv5 = await model.count({ number: 5 })
    const lv6 = await model.count({ number: 6 })
    const lv7 = await model.count({ number: 7 })

    if(lv1 == 0) await model.create({ number: 1, exp: 0, bonus: { payment: 0 }, limit: { member: 20 } })
    if(lv2 == 0) await model.create({ number: 2, exp: 5000000, bonus: { payment: 2 }, limit: { member: 50 } })
    if(lv3 == 0) await model.create({ number: 3, exp: 10000000, bonus: { payment: 5 }, limit: { member: 100 } })
    if(lv4 == 0) await model.create({ number: 4, exp: 50000000, bonus: { payment: 10 }, limit: { member: 500 } })
    if(lv5 == 0) await model.create({ number: 5, exp: 100000000, bonus: { payment: 20 }, limit: { member: 1000 } })
    if(lv6 == 0) await model.create({ number: 6, exp: 200000000, bonus: { payment: 30 }, limit: { member: 2000 } })
    if(lv7 == 0) await model.create({ number: 7, exp: 500000000, bonus: { payment: 50 }, limit: { member: 5000 } })
  }

  autoCreate()
  return model
}

export const DBGuild = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGuild>({ 
    name: { type: String },
    description: { type: String },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'GuildLevel', index: true },
    currency: {
      exp: { type: Number, default: 0 }
    },
    request: {
      active: { type: Boolean, default: true },
      auto: { type: Boolean, default: false },
      level: { type: Number, default: 1 }
    },
    master: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text' })
  const model = mongoose.model('Guild', schema, 'Guild')
  return model 
}

export const DBGuildRequest = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGuildRequest>({ 
    guild: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GuildRequest', schema, 'GuildRequest')
  return model 
}

export const DBGuildMember = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGuildMember>({ 
    guild: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - Master
    donate: { type: Number, default: 0, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GuildMember', schema, 'GuildMember')
  return model 
}

export const DBGuildDonate = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGuildDonate>({ 
    guild: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    coin: { type: Number, default: 0, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GuildDonate', schema, 'GuildDonate')
  return model 
}