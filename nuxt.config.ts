import { join } from 'path'

export default defineNuxtConfig({
  devtools: { enabled: false },

  srcDir: join(__dirname, './src/client'),

  serverDir: join(__dirname, './src/server'),

  nitro: {
    output: { 
      dir: './dist/server',
      serverDir: './dist/server/core', 
      publicDir: './dist/server/public' 
    }
  },

  runtimeConfig: {
    dev: process.env.NODE_ENV === 'production' ? false : true,
    mongoURI: process.env.MONGO_URI,
    mongoDB: process.env.MONGO_DB,
    apiSecret: process.env.SECRET,
    
    public: {
      dev: process.env.NODE_ENV === 'production' ? false : true,
      clientURL: process.env.CLIENT_URL,
      domain: process.env.DOMAIN,
      collab: process.env.COLLAB,
      cookieConfig: {
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        domain: process.env.NODE_ENV === 'production' ? `.${process.env.DOMAIN}` : undefined
      },
      version: process.env.VERSION
    }
  },

  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/ui', '@nuxt/icon', ['@nuxtjs/google-fonts', {
    display: 'swap',
    download: true,
    families: {
      Lexend: [300,400,500,600,700,800,900],
    }
  }], ['@nuxtjs/robots', {
    rules: [
      { UserAgent: '*' },
      { Disallow: '/manage/*' },
      { Disallow: '/.nuxt/*' },
      { BlankLine: true },
      { Sitemap: `${process.env.CLIENT_URL}/sitemap.xml` }
    ]
  }], 'nuxt-rate-limit', '@nuxtjs/device', 'nuxt-lazy-hydrate', 'nuxt-tiptap-editor', 'nuxt-swiper', '@vite-pwa/nuxt'],

  nuxtRateLimit: {
    routes: {
      '/api/*': {
        maxRequests: 10,
        intervalSeconds: 1,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'vi' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      meta: [
        { name: 'theme-color', content: '#09121b' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  css: [
    '@/app.sass'
  ],

  colorMode: {
    preference: 'dark'
  },

  icon: {
    serverBundle: 'remote',
  },

  image: {
    domains: [
      process.env.DOMAIN as string
    ]
  },

  tiptap: {
    prefix: 'Tiptap'
  },

  vite: {
    css: {
      preprocessorOptions: {
        sass: {
          api: 'modern',
        },
      },
    },
  },

  pwa: {
    manifest: {
      name: process.env.NAME,
      short_name: process.env.SHORT_NAME,
      description: 'PWA App',
      theme_color: '#09121b',
      background_color: '#09121b',
      display: 'fullscreen',
      icons: [
        { src: 'pwa/64.png', sizes: "64x64", type: 'image/png' },
        { src: 'pwa/144.png', sizes: "144x144", type: 'image/png' },
        { src: 'pwa/192.png', sizes: "192x192", type: 'image/png' },
        { src: 'pwa/512.png', sizes: "512x512", type: 'image/png', purpose: 'any'  },
        { src: 'pwa/512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
      ]
    },
    workbox: {
      navigateFallback: '/',
      sourcemap: true
    },
    registerType: 'autoUpdate'
  },

  compatibilityDate: '2025-06-01'
})