<template>
  <UiContent title="Payment" sub="Danh sách nạp tệ trò chơi">
    <UiFlex class="mb-2 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
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
        <template #code-data="{ row }">
          <UiText weight="semibold" color="primary">{{ row.code }}</UiText>
        </template>

        <template #user-data="{ row }">
          <span v-if="!row.user ">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer">
            {{ row.user ? row.user.username : '...' }}
          </UBadge>
        </template>

        <template #coin-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.coin) }} - {{ Math.floor(row.coin / configStore.config.yuan) }} Tệ</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #verify_person-data="{ row }">
          <span v-if="!row.verify.person">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer">
            {{ row.verify.person.username }}
          </UBadge>
        </template>

        <template #verify_time-data="{ row }">
          {{ row.verify ? useDayJs().displayFull(row.verify.time) : '...' }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="mt-2">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Success -->
    <UModal v-model="modal.success" preventClose>
      <UForm :state="stateSuccess" @submit="successAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateSuccess.code" readonly />
        </UFormGroup>

        <UFormGroup label="Số xu">
          <UInput :model-value="toMoney(stateSuccess.coin)" readonly />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4 gap-1">
          <UButton type="submit" color="yellow" :loading="loading.success">Duyệt</UButton>
          <UButton color="gray" @click="modal.success = false" :disabled="loading.success">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Refuse -->
    <UModal v-model="modal.refuse" preventClose>
      <UForm :state="stateRefuse" @submit="refuseAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Mã giao dịch">
          <UInput :model-value="stateRefuse.code" readonly />
        </UFormGroup>

        <UFormGroup label="Lý do từ chối">
          <UTextarea v-model="stateRefuse.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4 gap-1">
          <UButton type="submit" :loading="loading.refuse" color="red">Từ chối</UButton>
          <UButton color="gray" @click="modal.refuse = false" :disabled="loading.refuse">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const configStore = useConfigStore()
const game = useAttrs().game
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'user',
    label: 'Người tạo',
  },{
    key: 'coin',
    label: 'Xu nạp',
    sortable: true
  },{
    key: 'status',
    label: 'Trạng thái',
    sortable: true
  },{
    key: 'verify_person',
    label: 'Người duyệt',
  },{
    key: 'verify_time',
    label: 'Ngày duyệt',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
    sortable: true
  },{
    key: 'actions',
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

// State
const stateSuccess = ref({
  _id: null,
  code: null,
  coin: null,
  status: null,
  game: game._id
})
const stateRefuse = ref({
  _id: null,
  code: null,
  coin: null,
  reason: null,
  status: null,
  game: game._id
})

// Modal
const modal = ref({
  success: false,
  refuse: false
})

// Loading
const loading = ref({
  load: true,
  success: false,
  refuse: false,
})

// Status
const statusFormat = {
  0: { label: 'Đang chờ', color: 'orange' },
  1: { label: 'Thành công', color: 'green' },
  2: { label: 'Từ chối', color: 'red' },
  3: { label: 'Hoàn tác', color: 'blue' },
}

// Actions
const actions = (row) => [
  [{
    label: 'Duyệt',
    icon: 'i-bx-check',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateSuccess.value).forEach(key => stateSuccess.value[key] = row[key])
      stateSuccess.value.game = game._id
      stateSuccess.value.status = 1
      modal.value.success = true
    }
  }],[{
    label: 'Từ chối',
    icon: 'i-bx-x',
    disabled: row.status > 0,
    click: () => {
      Object.keys(stateRefuse.value).forEach(key => stateRefuse.value[key] = row[key])
      stateRefuse.value.game = game._id
      stateRefuse.value.status = 2
      modal.value.refuse = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/china/manage/payment/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const successAction = async () => {
  try {
    loading.value.success = true
    await useAPI('game/china/manage/payment/verify', JSON.parse(JSON.stringify(stateSuccess.value)))

    loading.value.success = false
    modal.value.success = false
    getList()
  }
  catch (e) {
    loading.value.success = false
  }
}

const refuseAction = async () => {
  try {
    loading.value.refuse = true
    await useAPI('game/china/manage/payment/verify', JSON.parse(JSON.stringify(stateRefuse.value)))

    loading.value.refuse = false
    modal.value.refuse = false
    getList()
  }
  catch (e) {
    loading.value.refuse = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
