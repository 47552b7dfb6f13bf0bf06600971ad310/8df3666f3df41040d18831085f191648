<template>
  <DataEmpty class="min-h-[300px]" text="Vui lòng đăng nhập để tiếp tục" v-if="!authStore.isLogin"/>

  <DataInviteFriend v-else/>
</template>

<script setup>
const authStore = useAuthStore()
</script>