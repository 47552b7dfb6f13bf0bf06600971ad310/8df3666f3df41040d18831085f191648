<template>
  <UiContent title="Box Item" sub="Quản lý các gói vật phẩm soạn sẵn">
    <UiFlex class="mb-2 gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="sm" />
      </UForm>
      <UButton color="yellow" @click="modal.add = true" >Thêm mới</UButton>
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
          <UiText weight="semibold">{{ row.name }}</UiText>
        </template>

        <template #gift-data="{ row }">
          <DataGamePrivateItemList :items="row.gift" class="min-w-[400px] max-w-[400px]" :size="45" :game="game.code" />
        </template>
        
        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
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
    <UModal v-model="modal.add" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Tên gói">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup label="Vật phẩm">
          <SelectGamePrivateItemList class="bg-gray" v-model="stateAdd.gift" :game="game.code"/>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4 gap-1">
          <UButton type="submit" color="yellow" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Tên gói">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <UFormGroup label="Vật phẩm">
          <SelectGamePrivateItemList class="bg-gray" v-model="stateEdit.gift" :game="game.code" />
        </UFormGroup>

        <UiFlex justify="end" color="yellow" class="mt-4 gap-1">
          <UButton type="submit" color="yellow" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">Đóng</UButton>
        </UiFlex>
      </UForm>
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
    key: 'name',
    label: 'Tên gói'
  },{
    key: 'gift',
    label: 'Vật phẩm',
  },{
    key: 'updatedAt',
    label: 'Cập nhật',
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
  total: 0,
	game: game._id
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  name: null,
  gift: [],
	game: game._id
})

const stateEdit = ref({
  _id: null,
  name: null,
  gift: null,
	game: game._id
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  name: null,
  gift: [],
	game: game._id
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
    label: 'Sửa gói',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.game = game._id
      modal.value.edit = true
    }
  }],[{
    label: 'Xóa gói',
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('game/private/manage/item/box/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('game/private/manage/item/box/edit', JSON.parse(JSON.stringify(stateEdit.value)))

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
    await useAPI('game/private/manage/item/box/del', {
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

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/item/box/list', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>
