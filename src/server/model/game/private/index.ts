import type { Mongoose } from 'mongoose'
import type { 
  IDBGamePrivate, 
  IDBGamePrivateEvent, IDBGamePrivateEventHistory, 
  IDBGamePrivateGiftcode, IDBGamePrivateGiftcodeHistory, 
  IDBGamePrivateItem, IDBGamePrivateItemBox, 
  IDBGamePrivateRecharge, IDBGamePrivateRechargeHistory,
  IDBGamePrivateShopItem, IDBGamePrivateShopItemHistory, 
  IDBGamePrivateShopPack, IDBGamePrivateShopPackHistory, 
  IDBGamePrivateUser, 
  IDBGamePrivateUserLogin,
  IDBGamePrivateComment, 
  IDBGamePrivateServerOpen,
  IDBGamePrivateLogAdmin,
  IDBGamePrivateNews,
  IDBGamePrivateEgg,IDBGamePrivateEggHistory,
  IDBGamePrivateWheel,IDBGamePrivateWheelHistory,
  IDBGamePrivateRank, IDBGamePrivateRankLog
} from '~~/types'

export const DBGamePrivate = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivate>({ 
    platform: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePlatform', index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'GameCategory', index: true },

    name: { type: String },
    code: { type: String },
    key: { type: String },
    description: { type: String },
    image: {
      banner: { type: String, default: '' },
      logo: { type: String, default: '' },
      icon: { type: String, default: '' },
      review: [{ type: String }],
    },
    
    content: { type: String },

    ip: { type: String, default: '' },
    port: { type: Number, default: 80 },
    mobile: { type: Boolean, default: false },
    paygame: { type: Boolean, default: false },
    secret: { type: String, default: '@Secret' },
    api: {
      start: { type: String, default: '' },
      server: { type: String, default: '' },
      role: { type: String, default: '' },
      roles: { type: String, default: ''},
      mail: { type: String, default: '' },
      recharge: { type: String, default: '' },
      level: { type: String, default: '' },
      power: { type: String, default: '' },
      os: { type: String, default: '' },
    },

    play: {
      web: { type: String, default: '' },
      windows: { type: String, default: '' },
      android: { type: String, default: '' },
      ios: { type: String, default: '' },
    },

    rate: {
      shop: {
        default: { type: Number, default: 0 },
        
        limit: {
          number: { type: Number, default: 0 },
          expired: { type: Date },
        },

        vip: {
          month: { type: Number, default: 10 },
          forever: { type: Number, default: 30 },
        },
      },

      wheel: { type: Number, default: 10000 },
    },

    statistic: {
      play: { type: Number, index: true, default: 0 },
      view: { type: Number, index: true, default: 0 },
      user: { type: Number, index: true, default: 0 },
      revenue: { type: Number, index: true, default: 0 },
    },

    collab: {
      commission: { type: Number, index: true, default: 10 },
      use: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collab' }],
    },

    manager: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    hasecoin: { type: Boolean, default: false },
    open: { type: Boolean, default: false },
    pin: { type: Boolean, default: false },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text', code: 'text' })

  const model = mongoose.model('GamePrivate', schema, 'GamePrivate')
  return model 
}

// News
export const DBGamePrivateNews = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateNews>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    title: { type: String },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateNews', schema, 'GamePrivateNews')
  return model 
}

// Server Open
export const DBGamePrivateServerOpen = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateServerOpen>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    server_name: { type: String },
    opentime: { type: Date },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateServerOpen', schema, 'GamePrivateServerOpen')
  return model 
}

// User
export const DBGamePrivateUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    block: { type: Boolean, index: true, default: false },

    spend: {
      day: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      },
      week: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      },
      month: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      },
      total: {
        coin: { type: Number, index: true, default: 0 },
        count: { type: Number, index: true, default: 0 },
      }
    },

    login: {
      week: { type: Number, index: true, default: 0 },
      month: { type: Number, index: true, default: 0 },
      total: { type: Number, index: true, default: 0 },
      update: { type: Date, default: Date.now() },
    },

    egg: {
      one: [{
        index: { type: Number },
        history: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEggHistory', index: true }
      }],
      two: [{
        index: { type: Number },
        history: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEggHistory', index: true }
      }],
      three: [{
        index: { type: Number },
        history: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEggHistory', index: true }
      }],
      four: [{
        index: { type: Number },
        history: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEggHistory', index: true }
      }],
      five: [{
        index: { type: Number },
        history: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEggHistory', index: true }
      }],
      six: [{
        index: { type: Number },
        history: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEggHistory', index: true }
      }]
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateUser', schema, 'GamePrivateUser')
  return model 
}

export const DBGamePrivateUserLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateUserLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateUserLogin', schema, 'GamePrivateUserLogin')
  return model 
}

// Recharge
export const DBGamePrivateRecharge = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateRecharge>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    recharge_id: { type: String },
    recharge_name: { type: String },
    save_pay: { type: Number, default: 0, index: true },
    price: { type: Number, default: 0, index: true },
    pin: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  schema.index({ recharge_id: 'text', recharge_name: 'text' })
  const model = mongoose.model('GamePrivateRecharge', schema, 'GamePrivateRecharge')
  return model 
}

export const DBGamePrivateRechargeHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateRechargeHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    recharge: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateRecharge', index: true },

    price: { type: Number },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateRechargeHistory', schema, 'GamePrivateRechargeHistory')
  return model 
}

// Item
export const DBGamePrivateItem = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateItem>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    item_id: { type: String },
    item_name: { type: String },
    item_image: { type: String }
  }, {
    timestamps: true
  })
  
  schema.index({ item_id: 'text', item_name: 'text' })
  const model = mongoose.model('GamePrivateItem', schema, 'GamePrivateItem')
  return model 
}

export const DBGamePrivateItemBox = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateItemBox>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    name: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })
  
  schema.index({ name: 'text' })
  const model = mongoose.model('GamePrivateItemBox', schema, 'GamePrivateItemBox')
  return model 
}

// Shop Item
export const DBGamePrivateShopItem = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopItem>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },

    amount: { type: Number, default: 0, index: true },
    price: { type: Number, default: 0, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateShopItem', schema, 'GamePrivateShopItem')
  return model 
}

export const DBGamePrivateShopItemHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopItemHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },

    price: { type: Number, index: true },
    amount: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateShopItemHistory', schema, 'GamePrivateShopItemHistory')
  return model 
}

// Shop Pack
export const DBGamePrivateShopPack = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopPack>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    name: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
      amount: { type: Number, index: true },
    }],
    price: { type: Number, default: 0, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text' })

  const model = mongoose.model('GamePrivateShopPack', schema, 'GamePrivateShopPack')
  return model 
}

export const DBGamePrivateShopPackHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateShopPackHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateShopPack', index: true },

    price: { type: Number, index: true },
    amount: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateShopPackHistory', schema, 'GamePrivateShopPackHistory')
  return model 
}

// Giftcode
export const DBGamePrivateGiftcode = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateGiftcode>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    code: { type: String },
    servers: [{ type: String }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
      amount: { type: Number, index: true },
    }],
    limit: { type: Number, default: 0, index: true },
    expired: { type: Date, index: true },
    public: { type: Boolean, default: false, index: true },
    justone: { type: Boolean, default: false, index: true },
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  schema.index({ code: 'text' })

  const model = mongoose.model('GamePrivateGiftcode', schema, 'GamePrivateGiftcode')
  return model 
}

export const DBGamePrivateGiftcodeHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateGiftcodeHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    giftcode: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateGiftcode', index: true },

    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateGiftcodeHistory', schema, 'GamePrivateGiftcodeHistory')
  return model 
}

// Event
export const DBGamePrivateEvent = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateEvent>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    type: { type: String },
    need: { type: Number, default: 0, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
      amount: { type: Number, index: true },
    }],
    display: { type: Boolean, default: true, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateEvent', schema, 'GamePrivateEvent')
  return model 
}

export const DBGamePrivateEventHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateEventHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateEvent', index: true },

    type: { type: String },
    need: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateEventHistory', schema, 'GamePrivateEventHistory')
  return model 
}

// Wheel
export const DBGamePrivateWheel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateWheel>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    display: { type: Boolean, default: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateWheel', schema, 'GamePrivateWheel')
  return model 
}

export const DBGamePrivateWheelHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateWheelHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateWheelHistory', schema, 'GamePrivateWheelHistory')
  return model 
}

// Egg
export const DBGamePrivateEgg = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateEgg>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    one: {
      price: { type: Number, index: true, default: 100000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    two: {
      price: { type: Number, index: true, default: 50000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    three: {
      price: { type: Number, index: true, default: 40000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    four: {
      price: { type: Number, index: true, default: 30000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    five: {
      price: { type: Number, index: true, default: 20000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    six: {
      price: { type: Number, index: true, default: 10000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateEgg', schema, 'GamePrivateEgg')
  return model 
}

export const DBGamePrivateEggHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateEggHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },

    row: { type: String },
    index: { type: Number },

    item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateEggHistory', schema, 'GamePrivateEggHistory')
  return model 
}

// Rank
export const DBGamePrivateRank = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateRank>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    server: { type: String, index: true },
    type: { type: String },
    end: { type: Date, index: true },
    active: { type: Boolean, default: false, index: true },
    send: { type: Boolean, default: false, index: true },
    award: [{
      rank: { type: Number, index: true },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateItem', index: true },
        amount: { type: Number, index: true },
      }]
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateRank', schema, 'GamePrivateRank')
  return model 
}

export const DBGamePrivateRankLog = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateRankLog>({ 
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateRank' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateRankLog', schema, 'GamePrivateRankLog')
  return model 
}

// Comment
export const DBGamePrivateComment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateComment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivateUser', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateComment', schema, 'GamePrivateComment')
  return model 
}

// Log Admin
export const DBGamePrivateLogAdmin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGamePrivateLogAdmin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    game: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate', index: true },
    content: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GamePrivateLogAdmin', schema, 'GamePrivateLogAdmin')
  return model 
}
