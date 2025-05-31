<template>
  <div>
    <UiMinibanner title="Game Private" sub="Các trò chơi hay và hấp dẫn" type="game" class="mb-4 pb-3">
      <UiFlex class="w-full mt-4 gap-1" wrap>
        <UForm :state="page" @submit="page.current = 1, getList()" class="grow md:w-auto w-full">
          <UInput v-model="page.search" placeholder="Tìm kiếm trò chơi..." icon="i-bx-search" size="lg" :disabled="!!loading" />
        </UForm>

        <UiFlex class="gap-1 w-full sm:w-auto">
          <SelectGamePlatform v-model="page.platform" multiple size="lg" class="grow" :disabled="!!loading" />
          <SelectGameCategory v-model="page.category" multiple size="lg" class="grow" :disabled="!!loading" />
        </UiFlex>
      </UiFlex>
    </UiMinibanner>

    <DataGameList :loading="loading" :list="list" os="private" />

    <!-- Pagination -->
    <UiFlex justify="center" class="mt-4" v-if="page.total > page.size">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading"/>
    </UiFlex>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Game Private - ${configStore.config.name}`,
  ogTitle: () => `Game Private - ${configStore.config.name}`,
  description: () => 'Tính Năng Sắp Ra Mắt',
  ogDescription: () => 'Tính Năng Sắp Ra Mắt',
})

const list = ref([])
const loading = ref(false)

// Page
const page = ref({
  size: 12,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  search: null,
  platform: [],
  category: [],
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.platform, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/list/main', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  } 
}

getList()
</script>