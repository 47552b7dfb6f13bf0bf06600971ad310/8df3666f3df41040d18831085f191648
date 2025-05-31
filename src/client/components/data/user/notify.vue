<template>
  <UiFlex :class="`UserName user-level-${level} bg-user-level gap-1 px-[7px] py-[1px] rounded-2xl overflow-hidden`">
    <img :src="`/images/user/stone/${level}.png`" :width="20" class="select-none pointer-events-none" />
    <UiText size="md" weight="bold" class="capitalize">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
    <UiIcon name="i-fluent-speaker-2-16-filled" size="4"/>
    <slot></slot>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' },
})

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  const level = props.user.level ? (props.user.level.number || 1) : 1
  return level > 10 ? 10 : level
})
</script>