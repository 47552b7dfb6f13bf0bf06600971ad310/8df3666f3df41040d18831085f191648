<template>
  <UiFlex>
    <UiFlex :class="`guild-level-${level} bg-guild-level-process gap-1 px-[7px] py-[1px] rounded-2xl overflow-hidden`" @click="viewAction">
      <UiIcon name="i-bxs-castle" size="4" v-if="!!noIcon"/>
      <img :src="`/images/guild/${level}.png`" :width="sizeLevel[size]" class="select-none pointer-events-none" v-else />
      <UiText :size="size" weight="bold" class="capitalize line-clamp-1">{{ guild.name }}</UiText>
    </UiFlex>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataGuildInfoBox :fetch-id="guild._id" @close="view = false"/>
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  guild: { type: Object },
  size: { type: String, default: 'sm' },
  noIcon: { type: Boolean, default: false },
  noAction: { type: Boolean, default: false }
})

const view = ref(false)

const level = computed(() => {
  if(!props.guild) return 1
  if(!props.guild.level) return 1
  const level = props.guild.level ? (props.guild.level.number || 1) : 1
  return level > 7 ? 7 : level
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