<template>
  <UiContent title="Game Income" sub="Lịch sử thu nhập từ trò chơi">
    <SelectGameOs class="mb-2" v-model="page.os" :disabled="!!loading.list"/>

    <UiFlex class="mb-2 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm"/>
          <USelectMenu v-model="page.search.by" :options="['USER', 'LOG']" />
        </UiFlex>
      </UForm>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge color="gray" variant="soft">{{ row.user.username || '...' }}</UBadge>
        </template>

        <template #content-data="{ row }">
          <div class="whitespace-normal" v-html="row.content" />
        </template>

        <template #coin-data="{ row }">
          {{ useMoney().toMoney(row.coin) }}
        </template>

        <template #money-data="{ row }">
          <UiText color="green">+ {{ useMoney().toMoney(row.money || 0) }}</UiText>
        </template>

        <template #[`commission.level-data`]="{ row }">
          {{ row.commission.level }}%
        </template>

        <template #[`commission.game-data`]="{ row }">
          {{ row.commission.game }}%
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const route = useRoute()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'content',
    label: 'Hành động',
  },{
    key: 'coin',
    label: 'Xu thanh toán',
    sortable: true
  },{
    key: 'commission.game',
    label: 'Hoa hồng trò chơi',
    sortable: true
  },{
    key: 'commission.level',
    label: 'Hoa hồng CTV',
    sortable: true
  },{
    key: 'money',
    label: 'Thu nhập cho bạn',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'USER'
  },
  os: 'private',
  total: 0,
  collab: route.params._code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.os, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Loading
const loading = ref({
  load: true
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI(`collab/manage/code/income/game/${page.value.os}`, JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
