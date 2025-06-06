<template>
  <div>
    <UiFlex class="mb-2">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-1" />

      <UForm @submit="page.current = 1, getList()" class="max-w-[9rem] mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"></UInput>
      </UForm>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0'}}" class="bg-gray mb-2">
      <LoadingTable v-if="loading" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #game-data="{ row }">
          <NuxtLink :to="`/game/tool/${row.game.key}`" target="_blank">
            <UBadge variant="soft" color="primary" class="cursor-pointer">{{ row.game.name }}</UBadge>
          </NuxtLink>
        </template>

        <template #recharge-data="{ row }">
          <UiIcon name="i-bxs-check-circle" color="green" size="5" v-if="!!row.recharge"></UiIcon>
          <UiIcon name="i-bxs-x-circle" color="gray" size="5" v-else></UiIcon>
        </template>

        <template #mail-data="{ row }">
          <UiIcon name="i-bxs-check-circle" color="green" size="5" v-if="!!row.mail"></UiIcon>
          <UiIcon name="i-bxs-x-circle" color="gray" size="5" v-else></UiIcon>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end">
      <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user'])

const loading = ref(false)

const list = ref([])

const columns = [
  {
    key: 'game',
    label: 'Trò chơi',
  },{
    key: 'recharge',
    label: 'Tool nạp',
  },{
    key: 'mail',
    label: 'Tool thư',
  },{
    key: 'createdAt',
    label: 'Ngày bắt đầu',
    sortable: true
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: null,
  total: 0,
  user: props.user || null
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/public/played', JSON.parse(JSON.stringify(page.value)))
    
    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>