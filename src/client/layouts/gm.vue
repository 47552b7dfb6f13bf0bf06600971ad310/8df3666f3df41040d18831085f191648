<template>
  <slot></slot>
</template>

<script setup>
useSeoMeta({
  title: () => `Game Manage Pannel`,
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))
</script>