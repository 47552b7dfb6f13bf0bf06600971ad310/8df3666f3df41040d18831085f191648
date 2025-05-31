<template>
  <div :class="`UserName user-level-${level}`">
    <UiFlex class="relative gap-0.5 cursor-pointer z-[2]" >
      <DataGuildInfoName :guild="guild" :size="size" v-if="!!guild && !noGuild" />

      <UiFlex class="bg-user-level gap-1 pl-[7px] pr-[9px] py-[1px] rounded-2xl overflow-hidden" @click="viewAction">
        <img :src="`/images/user/stone/${level}.png`" :width="sizeLevel[size]" class="select-none pointer-events-none" />
        <UiText :size="size" weight="bold" class="capitalize">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
        <slot></slot>
      </UiFlex>
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="user._id" @close="view = false"/>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object },
  size: { type: String, default: 'sm' },
  noAction: { type: Boolean, default: false },
  noGuild: { type: Boolean, default: false },
})

const view = ref(false)

const level = computed(() => {
  if(!props.user) return 1
  if(!props.user.level) return 1
  const level = props.user.level ? (props.user.level.number || 1) : 1
  return level > 10 ? 10 : level
})

const guild = computed(() => {
  if(!props.user) return false
  if(!props.user.guild) return false
  if(Object.keys(props.user.guild).length === 0) return false
  return props.user.guild
})

const sizeLevel = {
  'xs': 16,
  'sm': 18,
  'md': 20,
  'lg': 22,
  'xl': 24,
  '2xl': 26,
  '3xl': 28,
}

const viewAction = () => {
  if(!!props.noAction) return
  view.value = true
}
</script>