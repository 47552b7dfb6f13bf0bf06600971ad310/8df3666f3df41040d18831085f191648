<template>
  <UiFlex :class="`relative rounded-2xl overflow-hidden bg-gray guild-level-${level} p-1`">
    <UiFlex justify="center" class="relative grow">
      <div class="bg-guild-level-process absolute rounded-2xl z-[0] left-0 top-0 h-full" :style="{ width: process+'%' }"></div>
      <UiText weight="semibold" class="z-[1] text-[11px] text-gray-300">{{ text }}</UiText>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  guild: { type: Object }
})

const level = computed(() => {
  if(!props.guild) return 1
  if(!props.guild.level) return 1
  const level = props.guild.level ? (props.guild.level.number || 1) : 1
  return level > 10 ? 10 : level
})

const process = computed(() => {
  if(!props.guild) return 0
  if(!props.guild.level) return 0
  if(!props.guild.level.next) return 100
  const line = Math.round((props.guild.currency.exp / props.guild.level.next.exp) * 100)
  return line > 100 ? 100 : line
})

const text = computed(() => {
  if(!props.guild) return null
  if(!props.guild.level) return null
  if(!props.guild.level.next) return 'Đã Đặt Cấp Cao Nhất'
  return `${props.guild.currency.exp} / ${props.guild.level.next.exp}`
})
</script>