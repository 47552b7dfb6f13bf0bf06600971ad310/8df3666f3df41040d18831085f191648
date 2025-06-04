<template>
  <div class="@container">
    <ClientOnly>
      <swiper-container 
        ref="containerRef" 
        :autoplay="{ delay: 3000, disableOnInteraction: false }" 
        :loop="true" 
        :slidesPerView="1"
      >
        <swiper-slide v-for="(item, idx) in list" :key="idx" class="rounded-2xl overflow-hidden" >
          <NuxtLink :to="`/news/${item.key}`">
            <UCard  :ui="{ body: { padding: 'p-0 sm:p-0'} }">
              <UiFlex items="start">
                <UiImg :src="item.og_image" w="16" h="9" img-size="700px" class="bg-card @3xl:max-w-[55%] @3xl:min-w-[55%] @3xl:w-[55%] w-full" />

                <div class="@3xl:p-6 p-4 @3xl:relative absolute bottom-0 bg-gray-blur backdrop-blur-sm w-full">
                  <UiFlex class="@3xl:mb-4 mb-1 @2xl:mb-2 gap-2">
                    <UiText color="gray" weight="semibold" class="text-xs">
                      {{ item.category?.name || 'News' }}
                    </UiText>
                    <UiDot :color="item.category?.color" />
                    <UiText color="gray" weight="semibold" class="text-xs">
                      {{ useDayJs().displayDay(item.createdAt) }}
                    </UiText>
                  </UiFlex>

                  <UiText weight="bold" class="line-clamp-3 mb-0.5 text-base @xl:text-xl @5xl:text-2xl @3xl:text-gray-300">
                    {{ item.title }}
                  </UiText>
                  
                  <UiText color="gray" class="line-clamp-1 @xl:line-clamp-2 @5xl:line-clamp-3 italic text-xs @xl:text-sm @2xl:text-base ">
                    {{ item.description }}
                  </UiText>

                  <UButton color="yellow" size="lg" class="@4xl:flex hidden mt-4">Xem Chi Tiết</UButton>
                </div>
              </UiFlex>
            </UCard>
          </NuxtLink>
        </swiper-slide>
      </swiper-container>
    </ClientOnly>
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 5,
  current: 1,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('news/public/list/latest', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    setTimeout(() => loading.value = false, 500)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => {
  setTimeout(getList, 1)
})
</script>