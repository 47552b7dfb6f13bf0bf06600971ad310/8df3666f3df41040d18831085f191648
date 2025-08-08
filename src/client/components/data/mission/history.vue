<template>
  <div>
    <UiFlex class="mb-2 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto" />
      
      <SelectDate time v-model="page.range.start" placeholder="Bắt đầu" size="sm" />
      <SelectDate time v-model="page.range.end" placeholder="Kết thúc" size="sm" />
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0'}}" class="bg-gray mb-2">
      <LoadingTable v-if="loading" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #mission-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.mission.name }}</UBadge>
        </template>

        <template #ecoin-data="{ row }">
          <UiText weight="semibold" color="green">+ {{ toMoney(row.ecoin) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['user', 'reload', 'collab'])

const { toMoney } = useMoney()

const loading = ref(true)

const list = ref([])

const columns = [
  {
    key: 'mission',
    label: 'Nhiệm vụ',
  },{
    key: 'ecoin',
    label: 'ECoin nhận',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
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
  range: {
    start: null,
    end: null
  },
  total: 0,
  user: props.user || null,
  collab: props.collab,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getList()
  if(!val && !page.value.range.end) return getList()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getList()
  if(!val && !page.value.range.start) return getList()
})
watch(() => props.reload, () => getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('mission/public/history', JSON.parse(JSON.stringify(page.value)))

    loading.value = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>