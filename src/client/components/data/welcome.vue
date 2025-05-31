<template>
  <UModal v-model="modal" prevent-close :ui="{ width: 'sm:max-w-[350px] max-w-[350px]' }">
    <UCard class="bg-card" :ui="{ ring: false }">
      <UiImg src="/images/welcome.png" class="w-[95%] mx-auto mb-6" />

      <UiFlex type="col" class="gap-1">
        <DataPromoPaymentFrist />
        <DataPromoPaymentSecond />
      </UiFlex>

      <UiFlex justify="center" class="mt-4 gap-2">
        <UButton color="gray" size="lg" @click="modal = false">Để Lúc Khác</UButton>
        <UButton color="yellow" size="lg" @click="modal = false, navigateTo('/payment')">Nhận Thưởng Ngay</UButton>
      </UiFlex>
    </UCard>
  </UModal>
</template>

<script setup>
const authStore = useAuthStore()
const modal = ref(false)

watch(() => authStore.welcome, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setWelcome(false))
</script>