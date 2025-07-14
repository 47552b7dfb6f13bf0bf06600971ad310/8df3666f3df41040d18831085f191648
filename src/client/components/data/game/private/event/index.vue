<template>
  <UiContent title="Sự Kiện" sub="Các sự kiện của trò chơi" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <ClientOnly>
      <swiper-container 
        :freeMode="true"
        :spaceBetween="5"
        slidesPerView="auto"
        class="rounded-2xl overflow-hidden mb-2"
      >
        <swiper-slide v-for="(option, index) in tabs" :key="index" class="!inline-block !w-auto">
          <UiButtonSelect
            @click="select(option.key)"
            :active="!!tab && tab == option.key"
            class="p-4 min-w-[100px] md:min-w-[120px]"
          >
            <UiFlex type="col">
              <UiIcon :name="option.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
              <UiText weight="bold" class="text-white text-xs md:text-sm">{{ option.label }}</UiText>
            </UiFlex>
          </UiButtonSelect>
        </swiper-slide>
      </swiper-container >
    </ClientOnly>

    <Transition name="page" mode="out-in">
      <DataGamePrivateEventLogin :game="game" v-if="tab == 'login'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventSpend :game="game" v-else-if="tab == 'spend'" @start-receive="updatePrivateEventReceive" />
      <!-- <DataGamePrivateEventRank :game="game" v-else-if="tab == 'rank'" @start-receive="updatePrivateEventReceive" /> -->
      <DataGamePrivateEventWheel :game="game" v-else-if="tab == 'wheel'" @start-receive="updatePrivateEventReceive" />
      <DataGamePrivateEventEgg :game="game" v-else-if="tab == 'egg'" @start-receive="updatePrivateEventReceive" />
    </Transition>
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
  // list.push({ label: 'Đua TOP', icon: 'i-mdi-trending-up', key: 'rank' })
  list.push({ label: 'Vòng Quay', icon: 'i-mynaui-wheel', key: 'wheel' })
  list.push({ label: 'Đập Trứng', icon: 'i-mdi-egg-easter', key: 'egg' })
  return list
})
const tab = ref(!!tabs.value[0] ? tabs.value[0].key : null)
const select = (type) => {
  tab.value = type
}
</script>