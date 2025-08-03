import type { Mongoose } from 'mongoose'
import type { IDBConfig, IDBConfigPermission } from '~~/types'

export const DBConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBConfig>({ 
    name: { type: String, default: 'ENI Studio' },
    short_name: { type: String, default: 'ENI' },
    description: { type: String, default: 'Một sản phẩm của ENI Group' },
    og_image: { type: String },
    logo_image: { type: String },
    makeby: { type: String, default: 'ENI Group' },
    article: {
      promotion: { type: String },
      about: { type: String },
      privacy: { type: String },
      terms: { type: String },
      passportchina: { type: String },
      paymentchina: { type: String },
    },
    security: {
      manage: {
        password: { type: String, default: 'eni@gm' }
      },
      register: {
        ip: { type: Number, default: 10 },
        device: { type: Number, default: 3 },
      }
    },
    license: { type: Boolean, default: false },
    yuan: { type: Number, default: 3500 },
    vip: {
      month: { type: Number, default: 500000 },
      forever: { type: Number, default: 5000000 },
    },
    guild: {
      create: { type: Number, default: 100000 },
    },
    promo: {
      register: {
        coin: { type: Number, default: 0 },
      },
      payment: {
        first: { type: Number, default: 100 },
        second: { type: Number, default: 50 },
      }
    },
    fake: {
      online: { type: Number, default: 0 },
    },
    download: {
      windows: { type: String, default: '' },
      mac: { type: String, default: '' },
      android: { type: String, default: '' },
      ios: { type: String, default: '' },
    },
    contact: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      address: { type: String, default: '' },
      prefix: { type: String, default: 'ENI' },
    },
    telebot: {
      payment: {
        create: { type: String, default: '' },
        receive: { type: String, default: '' },
      },
      game: {
        china: {
          payment: { type: String, default: '' },
        }
      }
    },
    social: {
      facebook: { type: String, default: '' },
      messenger: { type: String, default: '' },
      zalo: { type: String, default: '' },
      telegram: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      game: {
        china: { type: String, default: '' },
        private: { type: String, default: '' },
        tool: { type: String, default: '' },
      }
    },
    facebook: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_version: { type: String, default: '' },
      client_verify: { type: String, default: '' },
      client_ads: { type: String, default: '' },
    },
    google: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
      client_ads: { type: String, default: '' },
      mail_send_info: { type: String, default: '' }, 
      mail_send_secret: { type: String, default: '' }, 
    },
    tiktok: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
    },
    zalo: {
      client_id: { type: String, default: '' },
      client_secret: { type: String, default: '' },
      client_verify: { type: String, default: '' },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Config', schema, 'Config')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }

  autoCreate()
  return model 
}

export const DBConfigPermission = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBConfigPermission>({ 
    statistic: [{ type: Number }],

    log: [{ type: Number }],

    config: {
      get: [{ type: Number }],
      edit: [{ type: Number }],
      article: {
        get: [{ type: Number }],
        edit: [{ type: Number }],
      }
    },

    spend: {
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
    },

    user: {
      list: [{ type: Number }],
      edit: {
        profile: [{ type: Number }],
        currency: [{ type: Number }],
      },
      level: {
        list: [{ type: Number }],
        edit: [{ type: Number }],
      }
    },

    equip: {
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
    },

    ads: {
      from: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      }
    },

    ip: {
      whitelist: {
        list: [{ type: Number }],
        action: [{ type: Number }],
      },
      list: [{ type: Number }],
      action: [{ type: Number }],
    },

    device: {
      list: [{ type: Number }],
      action: [{ type: Number }],
    },

    news: {
      category: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
    },

    gate: {
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
    },

    payment: {
      coin: {
        list: [{ type: Number }],
        action: [{ type: Number }],
      },
      yuan: {
        list: [{ type: Number }],
        action: [{ type: Number }],
      }
    },

    game: {
      category: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      platform: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      private: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      tool: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      china: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      }
    },

    voucher: {
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
      history: {
        list: [{ type: Number }],
      }
    },

    mission: {
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
      history: {
        list: [{ type: Number }],
      }
    },

    forum: {
      category: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      list: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
    },

    collab: {
      level: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      notify: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
      },
      withdraw: {
        list: [{ type: Number }],
        action: [{ type: Number }],
      },
      list: [{ type: Number }],
      add: [{ type: Number }],
      edit: [{ type: Number }],
      del: [{ type: Number }],
    },

    ecoin: {
      shop: {
        list: [{ type: Number }],
        add: [{ type: Number }],
        edit: [{ type: Number }],
        del: [{ type: Number }],
        history: {
          list: [{ type: Number }],
          action: [{ type: Number }],
        }
      }
    }
  })

  const model = mongoose.model('ConfigPermission', schema, 'ConfigPermission')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({
      statistic: [3,100],

      log: [3,100],

      config: {
        get: [3,100],
        edit: [100],
        article: {
          get: [3,100],
          edit: [3,100],
        }
      },

      spend: {
        list: [100],
        add: [100],
        edit: [100],
        del: [100],
      },

      user: {
        list: [3,100],
        edit: {
          profile: [100],
          currency: [100],
        },
        level: {
          list: [3,100],
          edit: [100],
        }
      },

      equip: {
        list: [100],
        add: [100],
        edit: [100],
        del: [100],
      },

      ads: {
        from: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        }
      },

      ip: {
        whitelist: {
          list: [3,100],
          action: [100],
        },
        list: [3,100],
        action: [100],
      },

      device: {
        list: [3,100],
        action: [100],
      },

      news: {
        category: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        list: [3,100],
        add: [100],
        edit: [100],
        del: [100],
      },

      gate: {
        list: [3,100],
        add: [100],
        edit: [100],
        del: [100],
      },

      payment: {
        coin: {
          list: [3,100],
          action: [100],
        },
        yuan: {
          list: [3,100],
          action: [100],
        }
      },

      game: {
        category: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        platform: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        private: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        tool: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        china: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        }
      },

      voucher: {
        list: [3,100],
        add: [100],
        edit: [100],
        del: [100],
        history: {
          list: [3,100],
        }
      },

      mission: {
        list: [3,100],
        add: [100],
        edit: [100],
        del: [100],
        history: {
          list: [3,100],
        }
      },

      forum: {
        category: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        list: [3,100],
        edit: [100],
        del: [100],
      },

      collab: {
        level: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        notify: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
        },
        withdraw: {
          list: [3,100],
          action: [100],
        },
        list: [3,100],
        add: [100],
        edit: [100],
        del: [100],
      },

      ecoin: {
        shop: {
          list: [3,100],
          add: [100],
          edit: [100],
          del: [100],
          history: {
            list: [3,100],
            action: [100],
          }
        }
      }
    })
  }

  autoCreate()
  return model 
}

