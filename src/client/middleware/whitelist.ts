export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) return navigateTo('/')
    if(authStore.profile.type == undefined) return navigateTo('/')
    if(!authStore.isAdmin && !authStore.isSMod) return navigateTo('/')

    await useAPI('ip-device/whitelist/check')
    return navigateTo('/manage/@eni')
  }
  catch (e:any) {
    // return false
  }
})