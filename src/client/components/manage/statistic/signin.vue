<template>
  <div>
    <UiFlex class="mb-2">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" size="sm" class="mr-auto"/>
    
      <SelectDate v-model="page.range.start" placeholder="Bắt đầu" size="sm" class="ml-2 max-w-[140px]"/>
      <SelectDate v-model="page.range.end" placeholder="Kết thúc" size="sm" class="ml-1 max-w-[140px]"/>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #time-data="{ row }">
          <UiText color="primary" weight="semibold">{{row.timeformat}} {{ useDayJs().displayDay(row.time) }}</UiText>
        </template>

        <template #count-data="{ row }">
          {{  useMoney().toMoney(row.count) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue', 'collab'])
const emit = defineEmits(['update:modelValue'])

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'time',
    label: 'Thời gian',
    sortable: true
  },{
    key: 'count',
    label: 'Đăng nhập',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'time',
    direction: 'desc'
  },
  range: {
    start: null,
    end: null
  },
  total: 0,
  collab: props.collab
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


// Loading
const loading = ref({
  load: true,
})
 
// Fetch
const getList = async () => {
  try {
    let url = 'statistic/signin'
    if(!!props.collab) url = 'collab/manage/code/statistic/signin'

    loading.value.load = true
    const data = await useAPI(url, JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total

    const source = data.list.map(i => ({
      label: useDayJs().displayDay(i.time),
      value: i.count
    }))
    emit('update:modelValue', source)
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
