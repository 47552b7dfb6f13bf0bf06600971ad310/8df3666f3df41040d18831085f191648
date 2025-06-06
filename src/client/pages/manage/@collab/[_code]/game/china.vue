<template>
  <UiContent title="Game China" sub="Danh sách trò chơi China">
    <UiFlex class="mb-1 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      
      <UButton color="yellow" class="ml-auto" :disabled="!!loading.use" @click="actionUse(null, 'add-all')">Thêm Tất Cả</UButton>
      <UButton color="rose" :disabled="!!loading.use" @click="actionUse(null, 'del-all')">Xóa Tất Cả</UButton>
    </UiFlex>

    <UiFlex class="mb-2 gap-1 flex-col sm:flex-row">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full sm:w-auto">
        <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>

      <SelectGamePlatform v-model="page.platform" multiple size="sm" class="w-full sm:w-auto" :disabled="!!loading.list" />
      <SelectGameCategory v-model="page.category" multiple size="sm" class="w-full sm:w-auto" :disabled="!!loading.list" />
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #name-data="{ row }">
          <NuxtLink :to="`/game/china/${row.key}`" target="_blank" class="text-primary font-semibold">{{ row.name }}</NuxtLink>
        </template>

        <template #platform-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.platform.name }}</UBadge>
        </template>

        <template #category-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.category.name }}</UBadge>
        </template>

        <template #[`collab.commission-data`]="{ row }">
          {{ collab ? collab.level?.commission?.game?.china : 0 }}%
        </template>

        <template #collab_use-data="{ row }">
          <UButton :color="!row.collab_use ? 'primary' : 'rose'" size="xs" variant="link" :padded="false" :disabled="!!loading.use" @click="actionUse(row._id)">
            {{ !row.collab_use ? 'Thêm' : 'Xóa' }}
          </UButton>
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
const collab = ref(null)

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'name',
    label: 'Tên',
  },{
    key: 'platform',
    label: 'Nền tảng',
  },{
    key: 'category',
    label: 'Thể loại'
  },{
    key: 'rate.pay',
    label: 'Tỷ lệ nạp',
    sortable: true
  },{
    key: 'collab.commission',
    label: 'Hoa hồng'
  },{
    key: 'collab_use',
    label: 'Sử dụng',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'collab.commission',
    direction: 'desc'
  },
  search: {
    key: null,
  },
  platform: [],
  category: [],
  total: 0,
  collab: route.params._code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.platform, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Loading
const loading = ref({
  load: true,
  use: false
})
  
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/code/game/china/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
    collab.value = data.collab
  }
  catch (e) {
    loading.value.load = false
  } 
}

const actionUse = async (_id, type = 'toggle-single') => {
  try {
    loading.value.use = true
    await useAPI('collab/manage/code/game/china/use', {
      _id: _id,
      collab: page.value.collab,
      type: type
    })
    await getList()

    loading.value.use = false
  }
  catch (e) {
    loading.value.use = false
  } 
}

getList()
</script>
  