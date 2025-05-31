import type { Mongoose } from 'mongoose'
import type { IDBCollab, IDBCollabIncome, IDBCollabLevel, IDBCollabNotify, IDBCollabWithdraw } from "~~/types"

export const DBCollabLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabLevel>({
    number: { type: Number },
    commission: {
      game: {
        private: { type: Number, default: 0, index: true },
        china: { type: Number, default: 0, index: true },
        tool: { type: Number, default: 0, index: true },
      },
      vip: { type: Number, default: 0, index: true },
    },
    price: { type: Number, default: 0, index: true },
  })

  const model = mongoose.model('CollabLevel', schema, 'CollabLevel')
  return model 
}

export const DBCollab = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollab>({
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'CollabLevel', index: true },
    code: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    link: { type: String },
    money: { type: Number, default: 0, index: true },
    privilege: {
      edit_info: { type: Boolean, default: false },
      edit_gate: { type: Boolean, default: false },
    },
    info: {
      name: { type: String },
      short_name: { type: String },
      description: { type: String  },
      og_image: { type: String },
      logo_image: { type: String },
      download: {
        windows: { type: String },
        mac: { type: String },
        android: { type: String },
        ios: { type: String }
      },
      contact: {
        name: { type: String },
        phone: { type: String },
        email: { type: String },
        address: { type: String },
        prefix: { type: String },
      },
      social: {
        facebook: { type: String },
        messenger: { type: String },
        zalo: { type: String },
        telegram: { type: String },
        tiktok: { type: String },
        game: {
          china: { type: String },
          private: { type: String },
          tool: { type: String },
        }
      },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Collab', schema, 'Collab')
  return model 
}

export const DBCollabNotify = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabNotify>({
    collab: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab', index: true },
    title: { type: String },
    content: { type: String },
    pin: { type: Boolean, default: true  },
  }, {
    timestamps: true
  })

  const model = mongoose.model('CollabNotify', schema, 'CollabNotify')
  return model 
}

export const DBCollabIncome = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabIncome>({
    collab: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab', index: true },

    type: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    content: { type: String },
    coin: { type: Number, index: true },
    money: { type: Number, index: true },
    commission: {
      game: { type: Number, index: true },
      level: { type: Number, index: true },
    },

    game: { type: mongoose.Schema.Types.ObjectId },
    source: { type: mongoose.Schema.Types.ObjectId },
  }, {
    timestamps: true
  })

  const model = mongoose.model('CollabIncome', schema, 'CollabIncome')
  return model 
}

export const DBCollabWithdraw = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBCollabWithdraw>({
    collab: { type: mongoose.Schema.Types.ObjectId, ref: 'Collab', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    code: { type: String },
    money: { type: Number, index: true },
    status: { type: Number, index: true, default: 0 },
    bank: {
      name: { type: String },
      number: { type: String },
      person: { type: String },
    },
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      time: { type: Date },
      reason: { type: String },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('CollabWithdraw', schema, 'CollabWithdraw')
  return model 
}