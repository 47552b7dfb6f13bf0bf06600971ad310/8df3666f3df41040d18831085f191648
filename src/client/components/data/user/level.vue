<template>
  <UiFlex :class="`relative rounded-2xl overflow-hidden bg-gray user-level-${level} p-1`">
    <UiFlex justify="center" class="relative grow">
      <div class="bg-user-level-process absolute rounded-2xl z-[0] left-0 top-0 h-full" :style="{ width: process+'%' }"></div>
      <UiText weight="semibold" class="z-[1] text-[11px] text-gray-300">{{ text }}</UiText>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  user: { type: Object }
})

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  return props.user.level ? (props.user.level.number || 1) : 1
})

const process = computed(() => {
  if(!props.user) return 0
  if(!props.user.level) return 0
  if(!props.user.level.next) return 100
  const line = Math.round((props.user.currency.exp / props.user.level.next.exp) * 100)
  return line > 100 ? 100 : line
})

const text = computed(() => {
  if(!props.user) return null
  if(!props.user.level) return 'Không có cấp độ'
  if(!props.user.level.next) return 'Đã Đặt Cấp Cao Nhất'
  return `${props.user.currency.exp} / ${props.user.level.next.exp}`
})
</script>