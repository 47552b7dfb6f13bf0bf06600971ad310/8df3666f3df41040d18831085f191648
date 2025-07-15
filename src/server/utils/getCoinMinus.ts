import type { IDBUser } from "~~/types"

interface IDataMinus {
  lcoin: number
  coin: number
}

export default (currency : IDBUser['currency'], value : number) : IDataMinus => {
  const total = currency.coin + currency.lcoin
  if(total < value) throw 'Số dư xu của bạn không đủ'

  let lcoin = 0
  let coin = 0

  if (currency.lcoin >= value) {
    lcoin = value
  } 
  else {
    lcoin = currency.lcoin
    coin = value - lcoin
  }

  return { lcoin, coin }
} 