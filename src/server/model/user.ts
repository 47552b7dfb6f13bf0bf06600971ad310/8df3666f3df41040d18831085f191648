import type { Mongoose } from 'mongoose'
import type { IDBUser, IDBUserDevice, IDBUserIP, IDBUserLevel, IDBUserLogin } from '~~/types'

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String, default: '/images/user/default.png' },
    description: { type: String },
    character: {
      sex: { type: Number, default: 0 },
      body: {
        bag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true }],
        use: { type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true },
        level: { type: Number, default: 0 }
      },
      wing: {
        bag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true }],
        use: { type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true },
        level: { type: Number, default: 0 }
      },
      weapon: {
        bag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true }],
        use: { type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true },
        level: { type: Number, default: 0 }
      },
      pet: {
        bag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true }],
        use: { type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true },
        level: { type: Number, default: 0 }
      },
      circle: {
        bag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true }],
        use: { type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true },
        level: { type: Number, default: 0 }
      },
      title: {
        bag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true }],
        use: { type: mongoose.Schema.Types.ObjectId, ref: 'Equip', index: true },
        level: { type: Number, default: 0 }
      }
    },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLevel', index: true },
    guild: { type: mongoose.Schema.Types.ObjectId, ref: 'Guild', index: true },
    vip: {
      month: {
        enable: { type: Boolean, default: false },
        end: { type: Date }
      },
      forever: {
        enable: { type: Boolean, default: false },
        end: { type: Date }
      }
    },
    invite: {
      code: { type: String },
      friend: { type: Number, default: 0, index: true }
    },
    reg: {
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'AdsFrom', index: true },
      collab: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab', index: true },
      platform: { type: String, default: 'local' },
    },
    social: {
      facebook: { type: String, default: '' },
      messenger: { type: String, default: '' },
      zalo: { type: String, default: '' },
      telegram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },
    currency: {
      exp: { type: Number, default: 0, index: true },
      coin: { type: Number, default: 0, index: true },
      lcoin: { type: Number, default: 0, index: true },
      ecoin: { type: Number, default: 0, index: true }
    },
    statistic: {
      pay: { type: Number, default: 0, index: true },
    },
    china: {
      youxi: { type: Boolean, default: false },
    },
    vouchers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', index: true }],
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - GMod, 2 - FMod, 3 - SMod, 100 - Admin, 99 - Robot
    online: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    token: { type: String },
    otp: {
      code: { type: String },
      expired: { type: Date },
    }
  }, {
    timestamps: true
  })

  schema.index({ username: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('User', schema, 'User')

  const autoCreate = async () => {
    const admin = await model.count({username: 'admin'})
    const bot = await model.count({username: 'bot'})
    const test123 = await model.count({username: 'test123'})

    // Default
    if(bot == 0) await model.create({ username: 'bot', avatar: '/images/user/robot.png', type: 99, currency: { exp: 100000000 } })
    if(admin == 0) await model.create({ username: 'admin', password: '93483a1b04eed0926606477ef0bb67b0', type: 100, currency: { exp: 100000000 } })
    if(test123 == 0) await model.create({ username: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 100, currency: { exp: 100000000 } })
  }

  autoCreate()
  return model
}

export const DBUserLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserLevel>({ 
    title: { type: String, default: '' },
    number: { type: Number, default: 1, index: true },
    exp: { type: Number, default: 0, index: true },
    bonus: {
      payment: { type: Number, default: 0, index: true },
      invite: {
        payment: { type: Number, default: 0, index: true },
      }
    },
    gift: {
      invite: { type: Number, default: 100, index: true },
    },
    limit: {
      chat: { type: Number, default: 10, index: true },
      invite: { type: Number, default: 5, index: true },
    },
    discount: {
      shop: { type: Number, default: 0, index: true }
    },
    voucher: {
      friend: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', index: true },
    }
  })

  const model = mongoose.model('UserLevel', schema, 'UserLevel')

  const autoCreate = async () => {
    const count = await model.count()
    if(count > 0) return

    // Default
    await model.create({ title: 'Luyện Khí', number: 1, exp: 0  })
    await model.create({ title: 'Trúc Cơ', number: 2, exp: 50000 })
    await model.create({ title: 'Kim Đan', number: 3, exp: 500000 })
    await model.create({ title: 'Nguyên Anh', number: 4, exp: 1000000 })
    await model.create({ title: 'Hóa Thần', number: 5, exp: 3000000 })
    await model.create({ title: 'Luyện Hư', number: 6, exp: 5000000 })
    await model.create({ title: 'Hợp Thể', number: 7, exp: 10000000 })
    await model.create({ title: 'Đại Thừa', number: 8, exp: 20000000 })
    await model.create({ title: 'Độ Kiếp', number: 9, exp: 50000000 })
    await model.create({ title: 'Chân Tiên', number: 10, exp: 100000000 })
    await model.create({ title: 'Thượng Tiên', number: 11, exp: 200000000 })
    await model.create({ title: 'Thiên Tiên', number: 12, exp: 300000000 })
    await model.create({ title: 'Tiên Vương', number: 13, exp: 400000000 })
    await model.create({ title: 'Tiên Quân', number: 14, exp: 500000000 })
    await model.create({ title: 'Tiên Đế', number: 15, exp: 1000000000 })
  }

  autoCreate()
  return model
}

export const DBUserIP = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserIP>({ 
    ip: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  })

  const model = mongoose.model('UserIP', schema, 'UserIP')
  return model 
}

export const DBUserDevice = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserDevice>({ 
    device: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  })

  const model = mongoose.model('UserDevice', schema, 'UserDevice')
  return model 
}

export const DBUserLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('UserLogin', schema, 'UserLogin')
  return model
}
