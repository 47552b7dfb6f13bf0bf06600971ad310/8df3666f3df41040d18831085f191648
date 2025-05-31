<template>
  <UiFlex :class="`w-full gap-2 p-2 guild-level-${level} cursor-pointer`" @click="viewAction">
    <UiFlex class="bg-gray rounded-full p-1">
      <img :src="`/images/guild/${level}.png`" class="w-[45px] min-w-[45px] max-w-[45px]" />
    </UiFlex>

    <div class="grow">
      <UiFlex class="gap-1 mb-2">
        <DataGuildInfoName :guild="guild" :size="size" no-icon no-action />

        <UiFlex class="bg-gray gap-1.5 px-2 pl-3 py-[1px] rounded-2xl overflow-hidden`" v-if="!noMember">
          <UiText size="sm" color="gray" weight="semibold">{{ guild.member }} / {{ guild.level.limit.member }}</UiText>
          <UiIcon name="i-bxs-group" size="4" />
        </UiFlex>
      </UiFlex>

      <slot></slot>
    </div>
  </UiFlex>

  <UModal v-model="view" :ui="{width: 'sm:max-w-[400px]'}">
    <DataGuildInfoBox :fetch-id="guild._id" @close="view = false"/>
  </UModal>
</template>

<script setup>
const props = defineProps({
  guild: { type: Object },
  size: { type: String, default: 'sm' },
  noView: { type: Boolean, default: false },
  noMember: { type: Boolean, default: false }
})

const view = ref(false)

const level = computed(() => {
  if(!props.guild) return 1
  if(!props.guild.level) return 1
  const level = props.guild.level ? (props.guild.level.number || 1) : 1
  return level > 7 ? 7 : level
})

const viewAction = () => {
  if(!!props.noView) return
  view.value = true
}
</script>