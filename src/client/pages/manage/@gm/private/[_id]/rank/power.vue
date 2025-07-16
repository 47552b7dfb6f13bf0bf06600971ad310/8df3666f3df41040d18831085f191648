<template>
  <UiContent title="Level Rank" sub="Quản lý quà đua TOP Lực Chiến máy chủ" no-dot>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UButton color="yellow" icon="i-bx-plus" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #server-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.server }}</UBadge>
        </template>
        
        <template #end-data="{ row }">
          {{ useDayJs().displayFull(row.end) }}
        </template>

        <template #send-data="{ row }">
          <UBadge :color="!!row.send ? 'primary' : 'gray'" variant="soft">{{ !!row.send ? 'Đã gửi' : 'Chưa' }}</UBadge>
        </template>

        <template #active-data="{ row }">
          <UBadge :color="!!row.active ? 'green' : 'gray'" variant="soft">{{ !!row.active ? 'Đang hoạt động' : 'Không' }}</UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="!!loading.del || !!loading.send"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Máy chủ">
          <SelectGameServer v-model="stateAdd.server" :game="game.code" type="private" />
        </UFormGroup>

        <UFormGroup label="Kết thúc">
          <SelectDate v-model="stateAdd.end" placeholder="Chọn ngày" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Máy chủ">
          <SelectGameServer v-model="stateEdit.server" :game="game.code" type="private" />
        </UFormGroup>

        <UFormGroup label="Kết thúc">
          <SelectDate v-model="stateEdit.end" placeholder="Chọn ngày" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <UiFlex class="mr-auto gap-2">
            <UToggle v-model="stateEdit.active" />
            <UiText size="sm" weight="semibold" color="gray" text="Kích hoạt" />
          </UiFlex>

          <UButton color="yellow" type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!--Modal Award-->
    <UModal v-model="modal.award" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent title="Phần Thưởng" sub="Chỉnh sửa thông tin quà tặng" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="loading.award" @click="modal.award = false"></UButton>
        </template>

        <ManageGamePrivateRankAward v-model="stateAward.award" :game="game" />

        <UiFlex justify="end" class="mt-2 gap-1">
          <UButton color="yellow" @click="awardAction" :loading="loading.award">Lưu</UButton>
          <UButton color="gray" @click="modal.award = false" :disabled="loading.award">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <!--Modal View-->
    <UModal v-model="modal.view" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent title="Xếp Hạng" sub="Thông tin bảng xếp hạng" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.view = false"></UButton>
        </template>

        <ManageGamePrivateRankView :fetch-id="stateView._id" :game="game" />
      </UiContent>
    </UModal>

    <!--Modal Log-->
    <UModal v-model="modal.log" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent title="Nhật Ký" sub="Lịch sử các tác vụ tự động" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.log = false"></UButton>
        </template>

        <ManageGamePrivateRankLog :fetch-id="stateView._id" :game="game" />
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const game = useAttrs().game

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'server',
    label: 'Máy chủ',
  },{
    key: 'end',
    label: 'Kết thúc',
    sortable: true
  },{
    key: 'send',
    label: 'Trả thưởng',
    sortable: true
  },{
    key: 'active',
    label: 'Kích hoạt',
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
  total: 0,
  type: 'power',
  game: game._id
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  type: 'power',
  server: null,
  end: null,
  award: [],
  game: game._id
})
const stateEdit = ref({
  _id: null,
  server: null,
  end: null,
  active: null,
  game: game._id
})
const stateAward = ref({
  _id: null,
  award: null,
  game: game._id
})
const stateView = ref({
  _id: null,
  game: game._id
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  award: false,
  view: false,
  log: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: 'power',
  server: null,
  end: null,
  award: [],
  game: game._id
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  award: false,
  del: false,
  send: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Xem xếp hạng',
    icon: 'i-bx-bar-chart-alt-2',
    click: () => {
      stateView.value._id = row._id
      stateView.value.game = game._id
      modal.value.view = true
    }
  },{
    label: 'Xem nhật ký',
    icon: 'i-icon-park-outline-log',
    click: () => {
      stateView.value._id = row._id
      stateView.value.game = game._id
      modal.value.log = true
    }
  }],[{
    label: 'Trả thưởng',
    icon: 'i-bx-mail-send',
    click: () => sendAction(row._id)
  }],[{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.game = game._id
      modal.value.edit = true
    }
  },{
    label: 'Sửa phần thưởng',
    icon: 'i-bx-gift',
    click: () => {
      stateAward.value._id = row._id
      stateAward.value.award = JSON.parse((JSON.stringify(row.award)))
      stateAward.value.game = game._id
      modal.value.award = true
    }
  }],[{
    label: 'Xóa tiến trình',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/rank/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('game/private/manage/rank/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/private/manage/rank/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const awardAction = async () => {
  try {
    loading.value.award = true
    await useAPI('game/private/manage/rank/award', JSON.parse(JSON.stringify(stateAward.value)))

    loading.value.award = false
    modal.value.award = false
    getList()
  }
  catch (e) {
    loading.value.award = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('game/private/manage/rank/del', { _id, game: game._id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const sendAction = async (_id) => {
  try {
    loading.value.send = true
    await useAPI('game/private/manage/rank/send', { _id, game: game._id })

    loading.value.send = false
    getList()
  }
  catch (e) {
    loading.value.send = false
  }
}

getList()
</script>
