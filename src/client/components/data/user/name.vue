<template>
  <div :class="`user-level-${level}`">
    <UiFlex class="relative gap-0.5 cursor-pointer z-[2]" >
      <DataGuildInfoName :guild="guild" :size="size" v-if="!!guild && !noGuild" />
      <UBadge :class="`user-level-${level} bg-user-level !text-white`" :size="size" @click="viewAction">
        <img :src="`/images/user/stone/${level > 10 ? 10 : level}.png`" :width="16" class="select-none pointer-events-none" />
        <UiText weight="bold" class="capitalize">{{ !!user ? user.username : 'Ẩn danh'}}</UiText>
        <slot></slot>
      </UBadge>
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
  return props.user.level ? (props.user.level.number || 1) : 1
})

const guild = computed(() => {
  if(!props.user) return false
  if(!props.user.guild) return false
  if(Object.keys(props.user.guild).length === 0) return false
  return props.user.guild
})

const viewAction = () => {
  if(!!props.noAction) return
  view.value = true
}
</script>