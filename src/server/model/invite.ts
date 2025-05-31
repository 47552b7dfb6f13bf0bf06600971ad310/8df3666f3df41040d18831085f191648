import type { Mongoose } from 'mongoose'
import type { IDBInvite, IDBInviteReward } from '~~/types'

export const DBInvite = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBInvite>({ 
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    payment: { type: Number, default: 0 , index: true },
    reward: { type: Number, default: 0 , index: true },
    receive: {
      invitation: { type: Boolean, default: false },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Invite', schema, 'Invite')
  return model 
}

export const DBInviteReward = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBInviteReward>({ 
    invite: { type: mongoose.Schema.Types.ObjectId, ref: 'Invite', index: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    number: { type: Number, default: 0 , index: true },
    reason: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('InviteReward', schema, 'InviteReward')
  return model 
}