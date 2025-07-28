<template>
  <div class="@container">
    <UiFlex justify="between" class="gap-2 mb-2" wrap>
      <UiTitle name="Chơi Gần Nhất" icon="i-jam-gamepad-f" />
      <UTabs :items="items" @change="onChange" class="space-y-0 w-full @2xl:w-auto" />
    </UiFlex>

    <DataEmpty :loading="loading" class="min-h-[250px]" v-if="!!loading || list.length == 0" />
    <DataGameListSlide :list="list" :os="selectedData.key" :no-statistic="true" v-else />
  </div>
</template>

<script setup>
const selected = ref(1)
const items = [
  { label: 'Game Private', key: 'private', icon: 'i-fluent-games-28-filled' },
  { label: 'Game Tool', key: 'tool', icon: 'i-ion-game-controller' },
]
const onChange = (index) => selected.value = index + 1
const selectedData = computed(() => items[selected.value-1])

const list = ref([])
const loading = ref(true)
const page = ref({
  size: 4,
  current: 1
})

const getList = async () => {
  try {
    loading.value = true

    const type = selectedData.value.key
    const data = await useAPI(`game/${type}/public/list/played`, JSON.parse(JSON.stringify(page.value)))

    list.value = data
    setTimeout(() => loading.value = false, 500)
  }
  catch (e) {
    loading.value = false
  } 
}

watch(selected, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>