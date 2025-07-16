<template>
  <div>
    <UiFlex justify="end" class="mb-2">
      <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex>

    <UCard class="bg-gray" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :columns="columns" :rows="list" v-model:sort="sort">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
        </template>

        <template #gift-data="{ row }">
          <DataGamePrivateItemList :items="row.gift" :size="45" :game="game.code" />
        </template>

        <template #actions-data="{ row, index }">
          <UButton icon="i-bx-edit-alt" color="gray" class="mr-1" @click="openEdit(row, index)" />
          <UButton icon="i-bx-trash" color="red" @click="delAction(index)" />
        </template>
      </UTable>
    </UCard>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Hạng">
          <UInput v-model="stateAdd.rank" />
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <SelectGamePrivateItemList class="bg-gray" v-model="stateAdd.gift" :game="game.code" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Hạng">
          <UInput v-model="stateEdit.rank" />
        </UFormGroup>

        <UFormGroup label="Phần thưởng">
          <SelectGamePrivateItemList class="bg-gray" v-model="stateEdit.gift" :game="game.code" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue', 'game'])
const emit = defineEmits(['update:modelValue'])
const list = ref(props.modelValue || [])

const columns = [
  {
    key: 'rank',
    label: 'Hạng',
  },{
    key: 'gift',
    label: 'Phần thưởng',
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]

const sort = ref({
  column: 'rank',
  direction: 'asc'
})

const stateAdd = ref({
  rank: null,
  gift: []
})

const stateEdit = ref({
  index: null,
  rank: null,
  gift: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  rank: null,
  gift: []
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.rank = row.rank
  stateEdit.value.gift = JSON.parse(JSON.stringify(row.gift))
  modal.value.edit = true
}

const addAction = () => {
  try {
    if(!stateAdd.value.rank) throw 'Vui lòng nhập thứ hạng'
    if(stateAdd.value.gift.length == 0) throw 'Vui lòng thêm ít nhất 1 quà tặng'

    const data = JSON.parse(JSON.stringify(stateAdd.value))
    const check = list.value.find(i => i.rank == data.rank)
    if(!!check) throw 'Thứ hạng đã tồn tại'
    list.value.push(data)

    emit('update:modelValue', list.value)
    modal.value.add = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const editAction = () => {
  try {
    if(!stateEdit.value.rank) throw 'Vui lòng nhập thứ hạng'
    if(stateEdit.value.gift.length == 0) throw 'Vui lòng thêm ít nhất 1 quà tặng'
    if(!list.value[stateEdit.value.index]) throw 'Chỉ mục thứ hạng sai'

    const data = JSON.parse(JSON.stringify(stateEdit.value))
    list.value[stateEdit.value.index].rank = data.rank
    list.value[stateEdit.value.index].gift = data.gift

    emit('update:modelValue', list.value)
    modal.value.edit = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const delAction = (index) => {
  try {
    if(!list.value[index]) throw 'Chỉ mục thứ hạng sai'
    list.value.splice(index, 1)

    emit('update:modelValue', list.value)
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}
</script>