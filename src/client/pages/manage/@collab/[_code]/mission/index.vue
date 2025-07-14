<template>
  <UiContent title="Mission Use" sub="Danh sách các nhiệm vụ đang áp dụng">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
    </UiFlex>

    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      > 
        <template #type-data="{ row }">
          <UBadge color="gray" variant="soft">{{ getLabelType(row.type) }}</UBadge>
        </template>

        <template #ecoin-data="{ row }">
          <UiText color="primary" weight="bold">{{ toMoney(row.ecoin) }}</UiText>
        </template>

        <template #expired-data="{ row }">
          <UBadge :color="!!row.expired ? 'orange' : 'gray'" variant="soft">
            {{ !!row.expired ? useDayJs().displayFull(row.expired) : 'Không' }}
          </UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="!!row.display ? 'green' : 'gray'" variant="soft">{{ !!row.display ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>

        <template #collab_use-data="{ row }">
          <UButton color="rose" size="xs" variant="link" :padded="false" :disabled="!!loading.use" @click="actionUse(row._id)">
            Xóa
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
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'type',
    label: 'Loại'
  },{
    key: 'name',
    label: 'Tên'
  },{
    key: 'ecoin',
    label: 'Phần thưởng',
    sortable: true
  },{
    key: 'expired',
    label: 'Hết hạn',
    sortable: true
  },{
    key: 'display',
    label: 'Hiển thị',
    sortable: true
  },{
    key: 'collab_use',
    label: 'Sử dụng',
    sortable: true
  }
]
const selectedColumns = ref([...columns])

const typeFormat = [
  { label: 'Nạp Đầu', value: 'pay.first' },
  { label: 'Nạp Lần 2', value: 'pay.second' },
  { label: 'Nạp Tiền', value: 'pay.success' },
  { label: 'Nâng VIP', value: 'vip.upgrade' },
  { label: 'Nâng Cảnh Giới', value: 'level.up' },
  { label: 'Chơi Game Private', value: 'game.private.play' },
  { label: 'Mua Tool Game', value: 'game.tool.buy' },
]

const getLabelType = (type) => {
  const find = typeFormat.find(i => i.value == type)
  return !!find ? find.label : 'Không xác định'
}

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  isuse: true,
  collab: route.params._code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// Loading
const loading = ref({
  load: true,
  use: false
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/code/mission/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}

const actionUse = async (_id, type = 'toggle-single') => {
  try {
    loading.value.use = true
    await useAPI(`collab/manage/code/mission/use`, { 
      _id: _id, type: type,
      collab: route.params._code
    })

    loading.value.use = false
    await getList()
  }
  catch (e) {
    loading.value.use = false
  } 
}

getList()
</script>
