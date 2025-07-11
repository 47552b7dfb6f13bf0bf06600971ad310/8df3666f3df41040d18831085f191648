export default defineNuxtRouteMiddleware(async (to, from) => {
  const runtimeConfig = useRuntimeConfig()
  const url = useRequestURL()

  // Ads From Cookie
  const adsFromCookie = useCookie('ads-from', runtimeConfig.public.cookieConfig)
  const codeAdsFrom = url.searchParams.get('f')
  if(!adsFromCookie.value && codeAdsFrom) {
    adsFromCookie.value = codeAdsFrom
    await useAPI('ads/public/from/view', { code: codeAdsFrom })
  }

  // Invited By Cookie
  const invitedByCookie = useCookie('invited-by', runtimeConfig.public.cookieConfig)
  const codeInvitedBy = url.searchParams.get('i')
  if(!invitedByCookie.value) invitedByCookie.value = codeInvitedBy ? codeInvitedBy.toString() : null
})