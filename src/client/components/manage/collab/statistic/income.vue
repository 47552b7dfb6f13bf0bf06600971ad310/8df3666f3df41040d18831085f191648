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
        :rows="listFormat"
      >
        <template #time-data="{ row }">
          <UiText color="primary" weight="semibold">{{ row.time == 'ALL' ? 'Tổng' : useDayJs().displayDay(row.time) }}</UiText>
        </template>

        <template #total-data="{ row }">
          <UiText 
            :color="row.time == 'ALL' ? 'primary' : null"
            :weight="row.time == 'ALL' ? 'bold' : null"
          >{{ useMoney().toMoney(row.total) }}</UiText>
        </template>

        <template #vip-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.vip) }}</UiText>
        </template>

        <template #private-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.private) }}</UiText>
        </template>

        <template #tool-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.tool) }}</UiText>
        </template>

        <template #china-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.china) }}</UiText>
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
    key: 'vip',
    label: 'Từ VIP',
    sortable: true
  },{
    key: 'private',
    label: 'Từ Game Private',
    sortable: true
  },{
    key: 'tool',
    label: 'Từ Game Tool',
    sortable: true
  },{
    key: 'china',
    label: 'Game China',
    sortable: true
  },{
    key: 'total',
    label: 'Tổng',
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

// Total
const listFormat = computed(() => {
  if(list.value.length == 0) return []

  const total = {
    time: 'ALL',
    vip: 0,
    private: 0,
    tool: 0,
    china: 0,
    total: 0
  }

  list.value.forEach(i => {
    total.vip = Number(total.vip) + Number(i.vip || 0)
    total.private = Number(total.private) + Number(i.private || 0)
    total.tool = Number(total.tool) + Number(i.tool || 0)
    total.china = Number(total.china) + Number(i.china || 0)
    total.total = Number(total.total) + Number(i.total || 0)
  })

  let newList = []
  newList.push(total)
  
  newList = newList.concat(list.value)
  return newList
})

// Loading
const loading = ref({
  load: true,
})
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/code/statistic/income', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total

    const source = data.list.map(i => ({
      label: useDayJs().displayDay(i.time),
      value: i.total
    }))
    emit('update:modelValue', source)
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
