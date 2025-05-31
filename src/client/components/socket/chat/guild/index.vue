<template>
  <UiFlex class="overflow-hidden" type="col">
    <DataGuildList v-if="!authStore.isLogin || (!!authStore.isLogin && !authStore.profile.guild)" />
    <SocketChatGuildMessage v-else />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
</script>