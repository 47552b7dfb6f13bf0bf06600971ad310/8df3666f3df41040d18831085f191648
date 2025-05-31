<template>
  <UiFlex class="box-purple rounded-2xl overflow-hidden gap-2 py-2 px-1 cursor-pointer" @click="navigateTo('/payment')">
    <UiImg src="/images/payment/promo-frist.png" class="h-[90%] w-[20%] md:w-[30%] ml-2" />
    <div>
      <UiText class="text-xs md:text-base mb-1">Thưởng nạp đầu</UiText>
      <UiText class="text-xl md:text-3xl" weight="bold">{{ configStore.config.promo.payment.first }}%</UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
</script>