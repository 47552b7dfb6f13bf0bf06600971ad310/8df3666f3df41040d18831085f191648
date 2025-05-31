import type { Types } from 'mongoose'

interface IData {
  user: Types.ObjectId,
  action: string,
  type: string,
  target?: string
}

export default async (data : IData) => {
  const log = await DB.LogUser.create(data)
  if(!!IO && !!data.user){
    IO.to(data.user.toString()).emit('notify-single-push', log)
  }
}