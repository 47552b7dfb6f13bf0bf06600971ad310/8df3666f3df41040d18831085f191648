<template>
  <NuxtLink :to="`/news/${news.key}`">
    <UCard class="overflow-hidden cursor-pointer" :ui="{
      divide: '',
      shadow: 'shadow',
      header: {
        padding: 'p-0 p-0 sm:p-0',
      },
      body: {
        padding: 'px-3 py-3 sm:p-4',
      },
      footer: {
        base: 'border-none',
        padding: 'px-3 py-0 pb-3 sm:px-4',
      }
    }">
      <template #header>
        <UiImg :src="news.og_image" w="16" h="9" class="box-blue" />
      </template>

      <template #default>
        <UiText weight="bold" class="mb-0.5 line-clamp-2 text-sm sm:text-base text-gray-300 hover:text-primary">
          {{ news.title }}
        </UiText>
        
        <UiText color="gray" class="italic line-clamp-2 text-xs min-h-[32px]">
          {{ news.description }}
        </UiText>

        <UiFlex justify="between" class="mt-2">
          <UiText color="gray" weight="semibold" size="xs">
            {{ news.category?.name || 'News' }}
          </UiText>

          <UiText color="gray" weight="semibold" size="xs">
            {{ useDayJs().displayDay(news.createdAt) }}
          </UiText>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['news'])
</script>