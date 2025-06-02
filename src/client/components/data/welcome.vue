<template>
  <UModal v-model="modal" prevent-close :ui="{ width: 'sm:max-w-[350px] max-w-[350px]' }">
    <UCard class="bg-card" :ui="{ ring: false }" >
      <UiImg src="/images/welcome.png" class="w-[95%] mx-auto " />
      <UiText align="center" color="gray" size="sm" class="mb-4">Chúng tôi tặng bạn những ưu đãi sau</UiText>

      <DataEmpty :loading="!!loading" class="min-h-[300px]" v-if="!!loading || !promo"></DataEmpty>

      <div v-else>
        <UiFlex type="col" class="gap-1">
          <DataPromoRegisterCoin v-if="promo.register.coin"/>
          <DataPromoPaymentFrist v-if="promo.payment.first" />
          <DataPromoPaymentSecond v-if="promo.payment.second"/>
          <DataPromoRegisterVoucher v-for="voucher in promo.vouchers" :key="voucher._id" :voucher="voucher" />
        </UiFlex>

        <UiFlex justify="center" class="mt-4 gap-1">
          <UButton color="gray" class="grow justify-center" size="lg" @click="modal = false">Để Lúc Khác</UButton>
          <UButton color="yellow" class="grow justify-center" size="lg" @click="modal = false, navigateTo('/payment')">Đi Nạp Ngay</UButton>
        </UiFlex>
      </div>
    </UCard>
  </UModal>
</template>

<script setup>
const authStore = useAuthStore()
const modal = ref(false)
const loading = ref(true)
const promo = ref()

const getPromo = async () => {
  try {
    loading.value = true
    const data = await useAPI('user/public/wellcome')

    promo.value = data
    loading.value = false
    modal.value = true
  }
  catch(e){
    loading.value = false
    modal.value = false
  }
}

watch(() => authStore.welcome, (val) => {
  if(!val) return
  getPromo()
})
watch(modal, (val) => !val && authStore.setWelcome(false))
</script>