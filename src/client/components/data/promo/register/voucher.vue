<template>
  <UiFlex class="box-red rounded-2xl overflow-hidden gap-2 py-2 px-1 cursor-pointer">
    <UiImg src="/images/icon/promo-reg.png" class="h-[90%] w-[20%] md:w-[30%] ml-2" />
    <div>
      <UiText class="text-xs md:text-base mb-1">{{ voucher.type == 'PAYMENT' ? 'Thẻ khuyến mãi nạp' : 'Thẻ giảm giá' }}</UiText>
      <UiText class="text-xl md:text-3xl" weight="bold">{{ voucher.value }}%</UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['voucher'])
</script>