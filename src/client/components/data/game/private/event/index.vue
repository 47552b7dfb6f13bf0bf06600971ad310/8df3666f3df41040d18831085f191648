<template>
  <UiContent title="Sự Kiện" sub="Các sự kiện của trò chơi" class="bg-card rounded-2xl p-4" no-dot>
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
      <DataGamePrivateEventLogin :game="game" v-if="tab == 'login'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventSpend :game="game" v-if="tab == 'spend'" @start-receive="updatePrivateEventReceive" />
    </div>
  </UiContent>
</template>

<script setup>
const { updatePrivateEventReceive } = useGameStore()
const props = defineProps(['game'])
const emits = defineEmits(['close', 'done'])

const tabs = computed(() => {
  const list = []
  list.push({ label: 'Điểm Danh', icon: 'i-mdi-human-hello-variant', key: 'login' })
  list.push({ label: 'Tiêu Xu', icon: 'i-ri-hand-coin-fill', key: 'spend' })
  return list
})
const tab = ref(tabs.value[0]['key'])
</script>