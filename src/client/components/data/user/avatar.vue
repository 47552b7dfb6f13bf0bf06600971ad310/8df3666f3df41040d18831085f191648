<template>
  <UiFlex justify="center" :class="`
    relative inline-flex
    user-level-${level} 
    ${user.online ? 'bg-green-500' : 'bg-rose-500'}
    rounded-full
    p-0.5
  `">
    <UAvatar 
      :class="`
        UserAvatar 
        rounded-full
        cursor-pointer
        bg-gray
        h-${sizeAvatar[size]} w-${sizeAvatar[size]}
      `"
      :ui="{wrapper: 'overflow-hidden'}"
      :src="user.avatar" 
      :alt="user.username"
      @click="viewAction"
    >
    </UAvatar>

    <UiFlex 
      class="
        absolute
        bottom-[-5px]
        rounded-2xl
        text-[0.6rem] font-bold
        py-0.5 px-2
      " 
      :class="`bg-vip-${vip}`"
      v-if="!!vip"
    >
      <UiText size="xs" weight="bold">VIP</UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="user._id" @close="modal = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'xs' },
  noAction: { type: Boolean, default: false },
  noLevel: { type: Boolean, default: false },
})

const vip = computed(() => {
  if(!props.user) return false
  if(!props.user.vip) return false
  if(!props.user.vip.month || !props.user.vip.forever) return false

  if(props.user.vip.month.enable) return 'month'
  if(props.user.vip.forever.enable) return 'forever'
  return false
})

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  const level = props.user.level ? (props.user.level.number || 1) : 1
  return level > 10 ? 10 : level
})

const levelShow = computed(() => {
  if(!props.user) return null
  if(!props.user.level) return null
  const level = props.user.level ? (props.user.level.number || 1) : 1
  return level
})

const sizeAvatar = {
  'xs': 8,
  'sm': 10,
  'md': 12,
  'lg': 14,
  'xl': 16,
  '2xl': 18,
  '3xl': 20,
}

const modal = ref(false)

const viewAction = () => {
  if(!!props.noAction) return
  modal.value = true
}
</script>

<style lang="sass">
.UserAvatar
  img
    width: 100%
    height: 100%
</style>
