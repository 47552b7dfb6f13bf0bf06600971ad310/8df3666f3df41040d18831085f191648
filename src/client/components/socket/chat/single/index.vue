<template>
  <DataEmpty text="Vui lòng đăng nhập để xem" v-if="!authStore.isLogin" />

  <UiFlex class="overflow-hidden" type="col" v-else>
    <SocketChatSingleConversation v-if="!socketStore.chat.single.now" />
    <SocketChatSingleMessage v-else />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const socketStore = useSocketStore()
</script>