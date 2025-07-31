import type { Types } from 'mongoose'
import type { IDBCollab } from './ads'

export interface IDBConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  makeby: string
  article: {
    about: string
    privacy: string
    terms: string
    passportchina: string
    paymentchina: string
  }
  security: {
    manage: {
      password: string
    }
    register: {
      ip: number
      device: number
    }
  }
  license: boolean
  yuan: number
  vip: {
    month: number
    forever: number
  }
  guild: {
    create: number
  }
  promo: {
    register: {
      coin: number
    }
    payment: {
      first: number
      second: number
    }
  }
  download: {
    windows: string
    mac: string
    android: string
    ios: string
  }
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  telebot: {
    payment: {
      create: string
      receive: string
    }
    game: {
      china: {
        payment: string
      }
    }
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
    game: {
      china: string
      private: string
      tool: string
    }
  }
  facebook: {
    client_id: string
    client_secret: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_secret: string
    client_verify: string
    client_ads: string
    mail_send_info: string
    mail_send_secret: string
  }
  tiktok: {
    client_id: string
    client_secret: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_secret: string
    client_verify: string
  }
}

export interface IDBConfigStore {
  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  makeby: string
  yuan: number
  vip: {
    month: number
    forever: number
  }
  guild: {
    create: number
  }
  promo: {
    register: {
      coin: number
    }
    payment: {
      first: number
      second: number
    }
  }
  download: {
    windows: string
    mac: string
    android: string
    ios: string
  }
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
    game: {
      china: string
      private: string
      tool: string
    }
  }
  facebook: {
    client_id: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_verify: string
    client_ads: string
  }
  tiktok: {
    client_id: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_verify: string
  }
}

export interface IDBConfigPermission {
  statistic: Array<number>

  log: Array<number>

  config: {
    get: Array<number>
    edit: Array<number>
    article: {
      get: Array<number>
      edit: Array<number>
    }
  }

  spend: {
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
  }

  user: {
    list: Array<number>
    edit: {
      profile: Array<number>
      currency: Array<number>
    }
    level: {
      list: Array<number>
      edit: Array<number>
    }
  }

  equip: {
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
  }

  ads: {
    from: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
  }

  ip: {
    whitelist: {
      list: Array<number>
      action: Array<number>
    }
    list: Array<number>
    action: Array<number>
  }

  device: {
    list: Array<number>
    action: Array<number>
  }

  news: {
    category: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
  }

  gate: {
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
  }

  payment: {
    coin: {
      list: Array<number>
      action: Array<number>
    }
    yuan: {
      list: Array<number>
      action: Array<number>
    }
  }

  game: {
    category: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    platform: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    private: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    tool: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    china: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
  }

  voucher: {
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
    history: {
      list: Array<number>
    }
  }

  mission: {
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
    history: {
      list: Array<number>
    }
  }

  forum: {
    category: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    list: Array<number>
    edit: Array<number>
    del: Array<number>
  }

  collab: {
    level: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    notify: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    withdraw: {
      list: Array<number>
      action: Array<number>
    }
    list: Array<number>
    add: Array<number>
    edit: Array<number>
    del: Array<number>
  }

  ecoin: {
    shop: {
      list: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
      history: {
        list: Array<number>
        action: Array<number>
      }
    }
  }
}