<template>
  <UiContent title="Game Manage" sub="Danh sách game đang quản lý" class="bg-card rounded-2xl" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')" :disabled="!!loading"></UButton>
    </template>

    <SelectGameOs v-model="page.os" class="mb-1" :disabled="!!loading"/>

    <UiFlex class="mb-2 gap-1 sm:flex-row flex-col" justify="between">
      <UForm :state="page" @submit="page.current = 1, getList()" class="grow w-full sm:w-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="md" :disabled="!!loading" />
      </UForm>

      <UiFlex class="gap-1 grow w-full sm:w-auto">
        <SelectGamePlatform v-model="page.platform" multiple size="md" class="grow" :disabled="!!loading" />
        <SelectGameCategory v-model="page.category" multiple size="md" class="grow" :disabled="!!loading" />
      </UiFlex>
    </UiFlex>

    <div class="HideScroll max-h-[60vh] overflow-y-auto">
      <DataGameList :loading="loading" :list="list" :os="page.os" :gm="true" max="6" @click="emits('to')"/>
    </div>

    <!-- Pagination -->
    <UiFlex justify="end" class="mt-4" v-if="page.total > page.size">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const emits = defineEmits(['to', 'close'])
const list = ref([])
const loading = ref(true)

const page = ref({
  size: 6,
  current: 1,
  sort: {
    column: 'statistic.play',
    direction: 'desc'
  },
  platform: [],
  category: [],
  total: 0,
  search: null,
  os: 'private'
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.platform, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.os, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/gm/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 500)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>