<template>
  <UiContent title="Bảng Xếp Hạng" sub="Xếp hạng những người chơi hàng đầu" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UiFlex class="mb-4 gap-1 md:gap-2">
      <UiButtonSelect
        v-for="(item, index) in tabs" :key="index"
        class="p-4 md:min-w-[130px] min-w-auto grow md:grow-0"
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
      <DataGamePrivateRankPower :game="game" v-if="tab == 'power'" />
      <DataGamePrivateRankLevel :game="game" v-if="tab == 'level'" />
      <DataGamePrivateRankSpend :game="game" v-if="tab == 'spend'" />
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
    list.push({ label: 'Tiêu phí', icon: 'i-streamline-coin-share-solid', key: 'spend' })
  return list
})
const tab = ref(tabs.value[0]['key'])
</script>