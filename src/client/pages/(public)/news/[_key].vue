<template>
  <div class="md:max-w-[900px] mx-auto">
    <DataEmpty loading class="min-h-[300px]" v-if="!!loading"/>

    <div v-else>
      <UiMinibanner :title="news.title" :sub="news.description" class="mb-4" />

      <!-- <UiImg 
        :src="news.og_image"
        w="16" h="9"
        img-size="xs:300px sm:600 md:800px 1000px"
        alt="News Banner"
        class="rounded-2xl"
        preload
      ></UiImg> -->

      <UiFlex class="gap-2 mb-6">
        <DataUserAvatar :user="news.updater" size="md"/>

        <div class="ml-2 pt-2">
          <DataUserName :user="news.updater" class="mb-2" />
          <UiText size="xs" color="gray">Đã đăng {{ useDayJs().displayFull(news.createdAt) }}</UiText>
        </div>
      </UiFlex>

      <div class="my-6">
        <DataEmpty class="h-[300px]" v-if="!news.content || news.content == '<p></p>'" />
        <UiEditorContent :content="news.content" v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
const { img } = useMakeLink()
const configStore = useConfigStore()
const route = useRoute()
const news = ref({
  title: '...',
  description: '...',
  og_image: null,
  updater: {
    username: '...',
  },
  category: {
    name: '...'
  },
  createdAt: '...',
  updatedAt: '...',
})
const loading = ref(true)

useSeoMeta({
  title: () => `${news.value.title} - Tin Tức - ${configStore.config.name}`,
  ogTitle: () => `${news.value.title} - Tin Tức - ${configStore.config.name}`,
  description: () => news.value.description,
  ogDescription: () => news.value.description,
  ogImage: () => img(news.value.og_image), 
  ogImageAlt: () => news.value.title,
  ogType: 'article',
  articleAuthor: () => news.value.updater.username,
  articleSection: () => news.value.category.name,
  articlePublishedTime: () => news.value.createdAt,
  articleModifiedTime: () => news.value.updatedAt
})

const getNews = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/key', {
      key: route.params._key
    })
    
    news.value = data
    loading.value = false
  }
  catch(e){
    return false
  }
}

getNews()
</script>