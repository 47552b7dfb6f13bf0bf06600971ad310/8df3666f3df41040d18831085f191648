<template>
  <UCard :ui="{ body: { padding: 'p-4 sm:p-4 pb-1 sm:pb-1' }}">
    <UiContent title="Tin Tức" sub="Các tin tức về trò chơi" class="GameNews" icon="i-bxs-news">
      <DataEmpty text="Chưa có tin tức mới" :loading="loading.list" class="min-h-[250px]" v-if="!!loading.list || list.length == 0" />

      <UiFlex type="col" class="divide-y divide-gray-100 dark:divide-gray-800" v-else>
        <div v-for="(news, index) in list" :key="index" class="w-full gap-2 py-3" justify="between" @click="viewNews(news)">
          <UiText weight="semibold" size="sm" class="text-gray-300 hover:text-primary hover:dark:text-primary" pointer>
            {{ news.title }}
          </UiText>
          
          <UiText color="gray" size="xs" variant="soft">{{ useDayJs().fromTime(news.createdAt) }}</UiText>
        </div>
      </UiFlex>

      <UiFlex justify="center" class="mt-2 pb-3" v-if="page.total > page.size">
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="2xs" />
      </UiFlex>
    </UiContent>

    <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent :title="newsSelect.title" :sub="useDayJs().fromTime(newsSelect.createdAt)" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal = false"></UButton>
        </template>

        <div class="max-h-[70vh] overflow-y-auto">
          <DataEmpty :loading="loading.content" class="min-h-[300px]" v-if="!!loading.content || !newsSelect.content || newsSelect.content == '<p></p>'"></DataEmpty>
          <UiEditorContent :content="newsSelect.content" v-else />
        </div>
      </UiContent>
    </UModal>
  </UCard>
</template>

<script setup>
const props = defineProps(['game', 'os'])

const list = ref([])
const newsSelect = ref({
  title: null,
  content: null,
  createdAt: null
})

const modal = ref(false)

const loading = ref({
  list: true,
  content: false
})

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  game: props.game?.code
})
watch(() => page.value.current, () => getList())

const viewNews = async (news) => {
  try {
    newsSelect.value.title = news.title
    newsSelect.value.createdAt = news.createdAt

    modal.value = true
    loading.value.content = true

    const data = await useAPI(`game/${props.os}/public/project/news/view`, { _id: news._id })
    newsSelect.value.content = data.content

    setTimeout(() => loading.value.content = false, 500) 
  }
  catch (e) {
    loading.value.content = false
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI(`game/${props.os}/public/project/news/list`, JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.list = false
  }
  catch (e) {
    loading.value.list = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>

<style lang="sass">
.GameNews
  .UiContentHeader
    margin-bottom: 0 !important
</style>