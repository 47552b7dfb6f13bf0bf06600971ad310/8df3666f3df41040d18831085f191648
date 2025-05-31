<template>
  <DataEmpty text="Vui lòng đăng nhập để xem" v-if="!authStore.isLogin" />

  <UiFlex class="overflow-hidden" type="col" v-else>
    <SocketNotifySingleList />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
</script>