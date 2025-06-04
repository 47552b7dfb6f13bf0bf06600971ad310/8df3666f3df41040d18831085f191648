<template>
  <UiFlex justify="center" :class="`
    relative inline-flex
    ${user.online ? 'bg-green-500' : 'bg-rose-500'}
    rounded-full
    p-0.5
  `" @click="viewAction">
    <UAvatar 
      :class="`
        UserAvatar 
        rounded-full
        cursor-pointer
        bg-gray
        h-${sizeAvatar[size]} w-${sizeAvatar[size]}
      `"
      :ui="{wrapper: 'overflow-hidden'}"
      
    >
      <UiImg :src="user.avatar" w="1" h="1" img-size="100px" class="w-full !rounded-full" />
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
  </UiFlex>

  <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
    <DataUserBox :fetch-id="user._id" @close="modal = false" />
  </UModal>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'xs' },
  noAction: { type: Boolean, default: false }
})

const vip = computed(() => {
  if(!props.user) return false
  if(!props.user.vip) return false
  if(!props.user.vip.month || !props.user.vip.forever) return false

  if(props.user.vip.month.enable) return 'month'
  if(props.user.vip.forever.enable) return 'forever'
  return false
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
