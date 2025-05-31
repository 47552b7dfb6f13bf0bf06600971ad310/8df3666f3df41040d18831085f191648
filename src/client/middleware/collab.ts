export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw 'Vui lòng đăng nhập trước'
    
    const codeCollab = to.params._code ? to.params._code : from.params._code ? from.params._code : null
    if(!codeCollab) throw 'Mã cộng tác viên không hợp lệ'

    await useAPI('collab/manage/code/check', { code: codeCollab })
  }
  catch (e:any) {
    return navigateTo('/')
  }
})