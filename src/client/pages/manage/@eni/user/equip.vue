<template>
  <UiContent title="Equip Character" sub="Quản lý trang bị nhân vật">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UiFlex class="gap-1">
          <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />

          <USelectMenu v-model="page.type" value-attribute="value" :options="[
            { label: 'Danh hiệu', value: 'title'},
            { label: 'Trang phục', value: 'body'},
            { label: 'Cánh', value: 'wing'},
            { label: 'Vũ khí', value: 'weapon'},
            { label: 'Thú cưng', value: 'pet'},
            { label: 'Pháp trận', value: 'circle'},
          ]" placeholder="Chọn loại" />
        </UiFlex>
      </UForm>

      <UButton color="yellow" class="ml-auto" @click="modal.add = true">Thêm mới</UButton>
      <UButton color="green" @click="exportJson">Xuất JSON</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="selectedColumns" :rows="list">
        <template #name-data="{ row }">
          <UiText color="primary" size="sm" weight="semibold">{{ row.name }}</UiText>
        </template>

        <template #sex-data="{ row }">
          {{ row.sex == 0 ? 'Tất cả' : row.sex == 1 ? 'Nam' : 'Nữ' }}
        </template>

        <template #power-data="{ row }">
          {{ useMoney().toMoney(row.power || 0) }}
        </template>

        <template #price-data="{ row }">
          {{ useMoney().toMoney(row.price || 0) }}
        </template>

        <template #display-data="{ row }">
          <UBadge :color="!!row.display ? 'green' : 'gray'" variant="soft">{{ !!row.display ? 'Hiện' : 'Ẩn' }}</UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="py-4">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Tên trang bị">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Mô tả">
          <UInput v-model="stateAdd.description" />
        </UFormGroup>

        <UFormGroup label="Loại">
          <USelectMenu v-model="stateAdd.type" value-attribute="value" size="lg" :options="[
            { label: 'Danh hiệu', value: 'title'},
            { label: 'Trang phục', value: 'body'},
            { label: 'Cánh', value: 'wing'},
            { label: 'Vũ khí', value: 'weapon'},
            { label: 'Thú cưng', value: 'pet'},
            { label: 'Pháp trận', value: 'circle'},
          ]"/>
        </UFormGroup>

        <UFormGroup label="Giới tính">
          <USelectMenu v-model="stateAdd.sex" value-attribute="value" size="lg" :options="[
            { label: 'Tất cả', value: 0},
            { label: 'Nam', value: 1},
            { label: 'Nữ', value: 2}
          ]" placeholder="Tất cả" />
        </UFormGroup>

        <UFormGroup label="Mã Res">
          <UInput v-model="stateAdd.res"/>
        </UFormGroup>

        <UFormGroup label="Lực chiến">
          <UInput v-model="stateAdd.power" type="number" />
        </UFormGroup>

        <UFormGroup label="Giá mua">
          <UInput v-model="stateAdd.price" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{ width: 'sm:max-w-3xl' }">
      <ManageEquipEdit v-model="stateEdit" @close="modal.edit = false" @save="editAction"/>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'name',
    label: 'Tên',
  },{
    key: 'type',
    label: 'Loại'
  },{
    key: 'sex',
    label: 'Giới tính',
    sortable: true
  },{
    key: 'res',
    label: 'Res',
    sortable: true
  },{
    key: 'power',
    label: 'Lực chiến',
    sortable: true
  },{
    key: 'price',
    label: 'Giá bán',
    sortable: true
  },{
    key: 'display',
    label: 'Hiển thị',
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
  search: null,
  type: null,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  name: null,
  description: null,
  type: null,
  sex: 0,
  res: null,
  power: null,
  price: null,
})
const stateEdit = ref(null)

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  name: null,
  description: null,
  type: null,
  sex: 0,
  res: null,
  power: null,
  price: null,
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
  export: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bxs-pencil',
    click: () => {
      stateEdit.value = row
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa trang bị',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('equip/manage/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('equip/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async (data) => {
  try {
    loading.value.edit = true
    await useAPI('equip/manage/edit', JSON.parse(JSON.stringify(data)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('equip/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const exportJson = async (data) => {
  try {
    loading.value.export = true
    const file = await useAPI('equip/manage/json/export')

    fetch(file.url)
    .then(response => response.json())
    .then(data => {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)

      loading.value.export = false
    })
  }
  catch (e) {
    loading.value.export = false
  }
}

getList()
</script>
