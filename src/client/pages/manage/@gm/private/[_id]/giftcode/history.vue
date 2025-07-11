<template>
  <UiContent title="History Giftcode" sub="Lịch sử nhập mã quà tặng" no-dot>
    <UiFlex class="mb-2 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['CODE', 'USER']" />
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
          <ManageUser v-else :user="row.user.user" />
        </template>

        <template #giftcode-data="{ row }">
          <UiText weight="semibold">{{ row.giftcode.code }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #del-data="{ row }">
          <UButton color="gray" icon="i-bx-trash" :disabled="loading.del" @click="delAction(row._id)"/>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="mt-2">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const game = useAttrs().game

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: 'Tài khoản',
  },{
    key: 'giftcode',
    label: 'Mã'
  },{
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'role',
    label: 'Nhân vật',
  },{
    key: 'createdAt',
    label: 'Ngày nhận',
    sortable: true
  },{
    key: 'del',
    label: 'Chức năng',
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
    by: 'CODE'
  },
  total: 0,
	game: game._id
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Loading
const loading = ref({
  load: true,
  del: false
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/giftcode/history/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('game/private/manage/giftcode/history/del', { 
			_id: _id,
			game: game._id
		})

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
