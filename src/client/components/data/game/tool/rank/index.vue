<template>
  <UiContent title="Bảng Xếp Hạng" sub="Xếp hạng những người chơi hàng đầu" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UiFlex class="mb-2 gap-1 md:gap-2">
      <UiButtonSelect
        v-for="(item, index) in tabs" :key="index"
        class="p-4 min-w-[130px]"
        :active="tab == item.key"
        @click="tab = item.key"
      >
        <UiFlex type="col">
          <UiIcon :name="item.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
          <UiText mini class="text-white text-xs md:text-sm" weight="bold">{{ item.label }}</UiText>
        </UiFlex>
      </UiButtonSelect>
    </UiFlex>

    <div>
      <DataGameToolRankPower :game="game" v-if="tab == 'power'" />
      <DataGameToolRankLevel :game="game" v-if="tab == 'level'" />
    </div>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close'])

const tabs = computed(() => {
  const list = []
    list.push({ label: 'Lực chiến', icon: 'i-tdesign-lighting-circle-filled', key: 'power' })
    list.push({ label: 'Cấp độ', icon: 'i-tdesign-user-arrow-up-filled', key: 'level' })
  return list
})
const tab = ref(tabs.value[0]['key'])
</script>