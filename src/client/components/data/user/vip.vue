<template>
  <UiFlex class="gap-1 px-[8px] py-[1px] rounded-2xl" :class="`bg-vip-${vip}`">
    <UiText :size="size" weight="bold">VIP</UiText>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['vip', 'size'])

const sizeVip = {
  'xs': 14,
  'sm': 16,
  'md': 18,
  'lg': 20,
  'xl': 22,
  '2xl': 24,
  '3xl': 26,
}
</script>