<template>
  <div>
    <UiFlex class="mb-2">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UButton color="yellow" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>

    <!-- Table -->
    <UCard class="bg-gray" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #title-data="{ row }">
          <UiText color="primary" weight="semibold" class="min-w-[200px] max-w-[200px] whitespace-normal">{{ row.title }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between" class="mt-2">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple placeholder="Chọn cột" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose :ui="{width: 'sm:max-w-[700px]' }">
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Tiêu đề">
          <UInput v-model="stateAdd.title" />
        </UFormGroup>

        <UFormGroup label="Nội dung">
          <UiEditor class="bg-gray" v-model="stateAdd.content"></UiEditor>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" color="yellow" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{width: 'sm:max-w-[700px]' }">
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Tiêu đề">
          <UInput v-model="stateEdit.title" />
        </UFormGroup>

        <UFormGroup label="Nội dung">
          <UiEditor class="bg-gray" v-model="stateEdit.content"></UiEditor>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" color="yellow" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['game'])

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'title',
    label: 'Tiêu đề',
  },{
    key: 'createdAt',
    label: 'Ngày tạo',
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
  game: props.game
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  game: props.game,
  title: null,
  content: null
})
const stateEdit = ref({
  _id: null,
  game: props.game,
  title: null,
  content: null
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  game: props.game,
  title: null,
  content: null
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
    label: 'Xóa bài viết',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/tool/manage/news/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('game/tool/manage/news/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/tool/manage/news/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('game/tool/manage/news/del', { 
      game: props.game,
      _id: _id
    })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>