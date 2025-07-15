import type { Mongoose } from 'mongoose'
import type { IDBMission, IDBMissionHistory } from '~~/types'

export const DBMission = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBMission>({ 
    type: { type: String, index: true },
    name: { type: String },
    expired: { type: Date },
    need: {
      game: {
        private: {
          source: { type: mongoose.Schema.Types.ObjectId, ref: 'GamePrivate' },
          server: { type: String },
          level: { type: Number },
          power: { type: Number },
        },
        tool: {
          source: { type: mongoose.Schema.Types.ObjectId, ref: 'GameTool' },
        }
      },
      payment: {
        first: { type: Number },
        second: { type: Number },
        money: { type: Number },
      },
      level: { type: mongoose.Schema.Types.ObjectId, ref: 'UserLevel' },
      vip: { type: String },
    },
    ecoin: { type: Number, index: true },
    collab: {
      use: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Collab' }],
    },
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', type: 'text' })

  const model = mongoose.model('Mission', schema, 'Mission')
  return model
}

export const DBMissionHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBMissionHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'Mission', index: true },
    type: { type: String, index: true },
    ecoin: { type: Number, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('MissionHistory', schema, 'MissionHistory')
  return model
}