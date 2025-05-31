<template></template>

<script setup>
import { useOnline } from '@vueuse/core'
const online = useOnline()
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const socketStore = useSocketStore()
const { $socket } = useNuxtApp()

watch(() => authStore.isLogin, (val) => {
  if(!!val) $socket.emit('online-join', authStore.profile._id )
  else {
    $socket.emit('online-logout')
    socketStore.changeChatData('single', { now: null, new: 0 })
    socketStore.changeChatData('guild', { new: 0 })
    socketStore.changeNotifyData('single', { new: 0 })
  }
})

// Kết nối lại khi online
watch(() => online, (val) => !!val && $socket.emit('online-join', authStore.isLogin ? authStore.profile._id : null))

onMounted(() => {
  // Web Update
  $socket.on('web-update', (collab) => {
    if(!collab) return configStore.bootConfig()
    if(collab == runtimeConfig.public.collab) return configStore.bootConfig()
  })

  // Auth Update
  $socket.on('auth-update', async () => !!authStore.isLogin && await authStore.setAuth())

  // Online
  $socket.emit('online-join', authStore.isLogin ? authStore.profile._id : null)
  $socket.on('online', (data) => socketStore.updateOnline(data))
  $socket.on('online-sign-in', () => {
    $socket.emit('chat-single-new') // Lấy thông tin số tin nhắn mới
    $socket.emit('notify-single-new') // Lấy thông tin số thông báo mới
  })

  // Chat Global
  $socket.on('chat-global-push', (data) => socketStore.changeChatData('global', { push: { update: socketStore.chat.global.push.update + 1, data: data } })) // Nhận tin nhắn thế giới mới
  $socket.on('chat-global-del', (data) => socketStore.changeChatData('global', { del: { update: socketStore.chat.global.del.update + 1, data: data } })) // Nhận tin nhắn thế giới bị xóa
  $socket.on('chat-global-send-error', (data) => useNotify().error(data.message))

  // Chat Single
  $socket.on('chat-single-new', data => socketStore.changeChatData('single', { new: data })) // Nhận thông tin số tin nhắn mới
  $socket.on('chat-single-push', (data) => { 
    socketStore.changeChatData('single', { push: { update: socketStore.chat.single.push.update + 1, data: data } })// Nhận tin nhắn mới

    // 3 trường hợp nhận số tin nhắn mới
    if(socketStore.tab != 'chat-single') return $socket.emit('chat-single-new') // Không trong tab tin nhắn
    if(!socketStore.chat.single.now) return $socket.emit('chat-single-new') // Không có hộp thư nào được mở
    if(socketStore.chat.single.now.toString() != data.conversation.toString()) return $socket.emit('chat-single-new') // Tin nhắn mới không thuộc hộp thư được mở
  })
  $socket.on('chat-single-push-me', (data) => socketStore.changeChatData('single', { push: { update: socketStore.chat.single.push.update + 1, data: data } }))
  $socket.on('chat-single-send-error', (data) => useNotify().error(data.message))

  // Chat Guild
  $socket.on('chat-guild-push', (data) => {
    socketStore.changeChatData('guild', { push: { update: socketStore.chat.guild.push.update + 1, data: data } })
    if(socketStore.tab != 'chat-guild') socketStore.changeChatData('guild', { new: socketStore.chat.guild.new + 1 }) // Không trong tab gia tộc thì đẩy số tin nhắn
  })
  $socket.on('chat-guild-del', (data) => socketStore.changeChatData('guild', { del: { update: socketStore.chat.guild.del.update + 1, data: data } })) // Nhận tin nhắn gia tộc bị xóa
  $socket.on('chat-guild-send-error', (data) => useNotify().error(data.message))

  // Notify Global
  $socket.on('notify-global-push', (data) => socketStore.changeNotifyData('global', { push: { update: socketStore.notify.global.push.update + 1, data: data } })) // Nhận thông báo thế giới mới
  
  // Notify Single
  $socket.on('notify-single-new', data => socketStore.changeNotifyData('single', { new: data })) // Nhận thông tin số thông báo mới
  $socket.on('notify-single-push', (data) => {
    socketStore.changeNotifyData('single', { push: { update: socketStore.notify.single.push.update + 1, data: data } }) // Nhận thông báo mới
    if(socketStore.tab != 'notify-single') return $socket.emit('notify-single-new') // Không trong tab thông báo, thì nhận số thông báo mới
  })

  // Guild
  $socket.on('guild-auth-join', async () => await authStore.setAuth()) // Kích hoạt khi được chấp nhận gia nhập gia tộc
  $socket.on('guild-auth-del', async () => { // Kích hoạt khi bị kích khỏi gia tộc
    await authStore.setAuth()
    socketStore.changeChatData('guild', { new: 0 })
    $socket.emit('chat-guild-leave-channel')
  }) 
  $socket.on('guild-delete',async () => { // Kích hoạt khi gia tộc bị xóa
    await authStore.setAuth()
    socketStore.changeChatData('guild', { new: 0 })
    $socket.emit('chat-guild-leave-channel')
  })
})
</script>