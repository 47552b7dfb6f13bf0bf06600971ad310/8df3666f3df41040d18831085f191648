<template>
  <UBadge :class="`guild-level-${level} bg-guild-level !text-white`" :size="size" @click="viewAction">
    <UiIcon name="i-bxs-castle" size="4" v-if="!!noIcon"/>
    <img :src="`/images/guild/${level}.png`" :width="16" class="select-none pointer-events-none" v-else />
    <UiText weight="bold" class="capitalize">{{ guild.name }}</UiText>

    <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataGuildInfoBox :fetch-id="guild._id" @close="view = false"/>
    </UModal>
  </UBadge>
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

const viewAction = () => {
  if(!!props.noAction) return
  view.value = true
}
</script>