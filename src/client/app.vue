<template>
  <NuxtLayout class="relative">
    <NuxtLoadingIndicator :height="2" />
    <UNotifications />
    <SocketNotifyGlobal v-if="route.meta.layout != 'play'"/>

    <NuxtPage />

    <SocketInit />
    <DataWelcome />
  </NuxtLayout>
</template>

<script setup>
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import colors from '#tailwind-config/theme/colors'
const runtimeConfig = useRuntimeConfig()
const appConfig = useAppConfig()
const configStore = useConfigStore()
const route = useRoute()

// Meta Seo
useSeoMeta({
  title: () => configStore.config.name,
  ogTitle: () => configStore.config.name,
  description: () => configStore.config.description,
  ogDescription: () => configStore.config.description,
  ogImage: () => new URL(configStore.config.og_image || '/images/null.webp', runtimeConfig.public.clientURL), 
  ogImageAlt: () => configStore.config.name,
  themeColor: () => colors[appConfig.ui.gray][900],
  ogType: 'website'
})

useHead({
  meta: [ 
    { name: 'facebook-domain-verification', content: configStore.config.facebook.client_verify },
    { name: 'google-site-verification', content: configStore.config.google.client_verify },
    { name: 'zalo-platform-site-verification', content: configStore.config.zalo.client_verify },
  ],
  script: [
    { children: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${configStore.config.facebook.client_ads}');
      fbq('track', 'PageView');
    `},
    { children: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer', '${configStore.config.google.client_ads}');
    `}
  ],
})

onMounted(async () => {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  if(result.visitorId) {
    const visitor = useCookie('visitor-id', runtimeConfig.public.cookieConfig)
    visitor.value = result.visitorId
  }
})
</script>