<template>
  <UiFlex class="gap-1">
    <DataPaymentFast :custom="true">
      <template #default="{ toggle }">
        <DataUserCoin @click="toggle()" />
      </template>
    </DataPaymentFast>

    <SocketNavSlide class="flex lg:hidden" />

    <AuthHeaderMenu />
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
</script>