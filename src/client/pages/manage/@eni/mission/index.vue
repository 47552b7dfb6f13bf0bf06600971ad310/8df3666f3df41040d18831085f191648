<template>
  <UiContent title="Mission" sub="Quản lý các nhiệm vụ hệ thống">
    <UiFlex class="mb-4">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
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

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
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
        <UFormGroup label="Tên nhiệm vụ">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Loại nhiệm vụ">
          <USelectMenu size="lg" placeholder="Bấm để chọn" v-model="stateAdd.type" :options="typeFormat" value-attribute="value" />
        </UFormGroup>

        <div class="mb-4">
          <ManageMissionNeedPayFirst v-model="stateAdd.need" v-if="stateAdd.type == 'pay.first'" />
          <ManageMissionNeedPaySecond v-model="stateAdd.need" v-if="stateAdd.type == 'pay.second'" />
          <ManageMissionNeedPaySuccess v-model="stateAdd.need" v-if="stateAdd.type == 'pay.success'" />
          <ManageMissionNeedVip v-model="stateAdd.need" v-if="stateAdd.type == 'vip.upgrade'" />
          <ManageMissionNeedLevel v-model="stateAdd.need" v-if="stateAdd.type == 'level.up'" />
          <ManageMissionNeedGamePrivatePlay v-model="stateAdd.need" v-if="stateAdd.type == 'game.private.play'" />
          <ManageMissionNeedGameToolBuy v-model="stateAdd.need" v-if="stateAdd.type == 'game.tool.buy'" />
        </div>

        <UFormGroup label="Phần thưởng">
          <UInput v-model="stateAdd.ecoin" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời gian hết hạn">
          <SelectDate v-model="stateAdd.expired" time placeholder="..." />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex class="mt-4 gap-1" justify="end">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Tên nhiệm vụ">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <div class="mb-4">
          <ManageMissionNeedPayFirst v-model="stateEdit.need" v-if="stateEdit.type == 'pay.first'" />
          <ManageMissionNeedPaySecond v-model="stateEdit.need" v-if="stateEdit.type == 'pay.second'" />
          <ManageMissionNeedPaySuccess v-model="stateEdit.need" v-if="stateEdit.type == 'pay.success'" />
          <ManageMissionNeedVip v-model="stateEdit.need" v-if="stateEdit.type == 'vip.upgrade'" />
          <ManageMissionNeedLevel v-model="stateEdit.need" v-if="stateEdit.type == 'level.up'" />
          <ManageMissionNeedGamePrivatePlay v-model="stateEdit.need" v-if="stateEdit.type == 'game.private.play'" />
          <ManageMissionNeedGameToolBuy v-model="stateEdit.need" v-if="stateEdit.type == 'game.tool.buy'" />
        </div>

        <UFormGroup label="Phần thưởng">
          <UInput v-model="stateEdit.ecoin" type="number" />
        </UFormGroup>

        <UFormGroup label="Thời gian hết hạn">
          <SelectDate v-model="stateEdit.expired" time placeholder="..." />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex class="mt-4 gap-1" justify="end">
          <UButton type="submit" :loading="loading.edit">Thêm</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
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
    key: 'actions',
    label: 'Chức năng',
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
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  name: null,
  expired: null,
  type: null,
  need: null,
  ecoin: 0,
  display: true
})
watch(() => stateAdd.value.type, (val) => (stateAdd.value.need = null))

const stateEdit = ref({
  _id: null,
  type: null,
  name: null,
  expired: null,
  need: null,
  ecoin: null,
  display: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  name: null,
  expired: null,
  type: null,
  need: null,
  ecoin: 0,
  display: true
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
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa nhiệm vụ',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('mission/manage/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('mission/manage/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('mission/manage/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('mission/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
