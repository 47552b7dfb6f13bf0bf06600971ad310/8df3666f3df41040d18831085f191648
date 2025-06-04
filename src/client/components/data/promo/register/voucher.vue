<template>
  <UiFlex class="box-red rounded-2xl overflow-hidden gap-2 py-2 px-1 cursor-pointer">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/promo-voucher.png" w="1" h="1" img-w="200" img-h="200" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">{{ voucher.type == 'PAYMENT' ? 'Thẻ khuyến mãi nạp' : 'Thẻ giảm giá' }}</UiText>
      <UiText class="text-xl md:text-3xl" weight="bold">{{ voucher.value }}%</UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['voucher'])
</script>