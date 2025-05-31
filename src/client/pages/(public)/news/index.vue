<template>
  <div>
    <UiMinibanner title="Tin Tức" sub="Các tin tức mới nhất và thông tin khuyến mãi" type="news" class="mb-4 pb-3">
      <UiFlex class="w-full mt-4 gap-1">
        <UForm :state="page" @submit="page.current = 1, getList()" class="grow">
          <UInput v-model="page.search" placeholder="Tìm kiếm tin tức..." icon="i-bx-search" size="lg" :disabled="!!loading" />
        </UForm>

         <SelectNewsCategory v-model="page.category" multiple size="lg" :disabled="!!loading" />
      </UiFlex>
    </UiMinibanner>

    <DataNewsList :list="list" :loading="loading" />

    <!-- Pagination -->
    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading"/>
    </UiFlex>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Tin Tức - ${configStore.config.name}`,
  ogTitle: () => `Tin Tức - ${configStore.config.name}`,
  description: () => 'Các tin tức mới nhất và thông tin khuyến mãi',
  ogDescription: () => 'Các tin tức mới nhất và thông tin khuyến mãi',
})

const list = ref([])
const loading = ref(true)

// Page
const page = ref({
  size: 12,
  current: 1,
  search: null,
  category: [],
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/list/main', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    return false
  } 
}

getList()
</script>