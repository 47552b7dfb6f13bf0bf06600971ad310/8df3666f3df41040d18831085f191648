<template>
  <UiContent title="Collab" sub="Quản lý Nguồn Cộng Tác Viên">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      <UButton color="yellow" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #level-data="{ row }">
          {{ row.level.number }}
        </template>

        <template #link-data="{ row }">
          <NuxtLink :to="useMakeLink().web(row.link)" target="_blank" class="text-primary font-semibold">
            {{ useMakeLink().web(row.link) }}
          </NuxtLink>
        </template>

        <template #user-data="{ row }">
          <ManageUser :user="row.user" />
        </template>

        <template #[`gatepay-data`]="{ row }">
          <UiText color="cyan" weight="semibold">{{ useMoney().toMoney(row.gatepay || 0) }}</UiText>
        </template>

        <template #[`money-data`]="{ row }">
          <UiText color="yellow" weight="semibold">{{ useMoney().toMoney(row.money || 0) }}</UiText>
        </template>

        <template #[`statistic.member-data`]="{ row }">
          {{ useMoney().toMoney(row.statistic.member || 0) }}
        </template>

        <template #[`statistic.payment-data`]="{ row }">
          <UiText color="primary" weight="semibold">{{ useMoney().toMoney(row.statistic.payment || 0) }}</UiText>
        </template>

        <template #[`statistic.income-data`]="{ row }">
          <UiText color="green" weight="semibold">{{ useMoney().toMoney(row.statistic.income || 0) }}</UiText>
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <UiFlex>
            <UDropdown :items="actions(row)">
              <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
            </UDropdown>
          </UiFlex>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Cấp CTV">
          <SelectCollabLevel v-model="stateAdd.level" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateAdd.code" />
        </UFormGroup>

        <UFormGroup label="Tài khoản CTV">
          <SelectUser v-model="stateAdd.user" />
        </UFormGroup>

        <UFormGroup label="Tên miền" >
          <UInput v-model="stateAdd.link" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Cấp CTV">
          <SelectCollabLevel v-model="stateEdit.level" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateEdit.code" />
        </UFormGroup>

        <UFormGroup label="Tên miền">
          <UInput v-model="stateEdit.link" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Privilege -->
    <UModal v-model="modal.privilege" preventClose>
      <UForm :state="statePrivilege" @submit="privilegeAction" class="bg-card rounded-2xl p-4">
        <UiFlex justify="between" class="mb-4">
          <UiText size="sm" weight="semibold" color="gray" text="Quyền thay đổi thông tin" />
          <UToggle v-model="statePrivilege.edit_info" />
        </UiFlex>

        <UiFlex justify="between">
          <UiText size="sm" weight="semibold" color="gray" text="Quyền thay đổi kênh nạp" />
          <UToggle v-model="statePrivilege.edit_gate" />
        </UiFlex>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Lưu</UButton>
          <UButton color="gray" @click="modal.privilege = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Gatepay -->
    <UModal v-model="modal.gatepay" preventClose>
      <UForm :state="stateGatepay" @submit="gatepayAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Thêm số dư thanh toán">
          <UInput v-model="stateGatepay.money" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton type="submit" :loading="loading.edit">Lưu</UButton>
          <UButton color="gray" @click="modal.gatepay = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const runtimeConfig = useRuntimeConfig()
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'link',
    label: 'Miền',
  },{
    key: 'level',
    label: 'Cấp',
  },{
    key: 'user',
    label: 'CTV',
  },{
    key: 'statistic.member',
    label: 'Tài khoản',
    sortable: true
  },{
    key: 'statistic.payment',
    label: 'Tổng doanh thu nạp',
    sortable: true
  },{
    key: 'statistic.income',
    label: 'Tổng thu nhập',
    sortable: true
  },{
    key: 'gatepay',
    label: 'Số dư thanh toán',
    sortable: true
  },{
    key: 'money',
    label: 'Số dư',
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
    column: 'statistic.payment',
    direction: 'desc'
  },
  search: null,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  level: null,
  code: null,
  user: null,
  link: null
})
const stateEdit = ref({
  _id: null,
  level: null,
  code: null,
  link: null
})
const statePrivilege = ref({
  _id: null,
  edit_info: false,
  edit_gate: false,
})
const stateGatepay = ref({
  _id: null,
  money: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  privilege: false,
  gatepay: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  level: null,
  code: null,
  user: null,
  link: null
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Quản lý chi tiết',
    icon: 'i-bxs-bar-chart-alt-2',
    click: () => useTo().openNewTab(`/manage/@collab/${row.code}`)
  }],
  [{
    label: 'Số dư thanh toán',
    icon: 'i-bx-plus',
    click: () => {
      stateGatepay.value._id = row._id
      modal.value.gatepay = true
    }
  }],
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.level = row.level._id
      modal.value.edit = true
    }
  },{
    label: 'Sửa quyền hạn',
    icon: 'i-bx-shield-quarter',
    click: () => {
      statePrivilege.value._id = row._id
      statePrivilege.value.edit_info = row.privilege ? row.privilege.edit_info : false
      statePrivilege.value.edit_gate = row.privilege ? row.privilege.edit_gate : false
      modal.value.privilege = true
    }
  }],[{
    label: 'Xóa cộng tác viên',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('collab/manage/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('collab/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('collab/manage/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const privilegeAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('collab/manage/privilege', JSON.parse(JSON.stringify(statePrivilege.value)))

    loading.value.edit = false
    modal.value.privilege = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const gatepayAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('collab/manage/gatepay', JSON.parse(JSON.stringify(stateGatepay.value)))

    loading.value.edit = false
    modal.value.gatepay = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('collab/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
