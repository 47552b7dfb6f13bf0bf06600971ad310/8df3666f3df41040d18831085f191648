<template>
  <UCard :ui="{ 
    body: { padding: 'p-0 sm:p-0' },
    header: { padding: 'p-2 sm:p-2' },
  }">
    <template #header>
      <UiFlex justify="end">
        <UButton color="gray" @click="modal.add = true">Thêm mới</UButton>
      </UiFlex>
    </template>
    
    <UTable :columns="columns" :rows="list">
      <template #image-data="{ row }">
        <DataGamePrivateItemImage :src="row.item_image" size="40" :game="props.game" />
      </template>

      <template #amount-data="{ row }">
        <UiText weight="semibold">{{ useMoney().toMoney(row.amount) }}</UiText>
      </template>

      <template #percent-data="{ row }">
        <UiText weight="semibold">{{ row.percent }}%</UiText>
      </template>

      <template #actions-data="{ row, index }">
        <UButton icon="i-bx-edit-alt" color="gray" class="mr-1" @click="openEdit(row, index)" />
        <UButton icon="i-bx-trash" color="red" @click="delAction(index)" />
      </template>
    </UTable>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Vật phẩm">
          <SelectGamePrivateItem v-model="stateAdd._id" v-model:itemData="stateAdd.item" :game="props.game" />
        </UFormGroup>

        <UFormGroup label="Số lượng">
          <UInput v-model="stateAdd.amount" type="number" />
        </UFormGroup>

        <UFormGroup label="Tỷ lệ">
          <UInput v-model="stateAdd.percent" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Vật phẩm">
          <UInput v-model="stateEdit.name" readonly />
        </UFormGroup>

        <UFormGroup label="Số lượng">
          <UInput v-model="stateEdit.amount" type="number" />
        </UFormGroup>

        <UFormGroup label="Tỷ lệ">
          <UInput v-model="stateEdit.percent" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const props = defineProps({
  modelValue: Array,
  game: String
})
const emit = defineEmits(['update:modelValue'])
const list = ref(props.modelValue || [])

const columns = [
  {
    key: 'image',
    label: 'Vật phẩm',
  },{
    key: 'item.item_name',
    label: 'Tên',
  },{
    key: 'amount',
    label: 'Số lượng'
  },{
    key: 'percent',
    label: 'Tỷ lệ'
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]

const stateAdd = ref({
  _id: null,
  item: null,
  amount: 1,
  percent: null
})

const stateEdit = ref({
  index: null,
  name: null,
  amount: null,
  percent: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  _id: null,
  item: null,
  amount: 1,
  percent: null
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.name = row.item.item_name
  stateEdit.value.amount = row.amount
  stateEdit.value.percent = row.percent
  modal.value.edit = true
}

const addAction = () => {
  try {
    if(!stateAdd.value._id || !stateAdd.value.item || !stateAdd.value.amount || !stateAdd.value.percent) throw 'Vui lòng nhập đầy đủ'
    if(stateAdd.value.percent < 1 || stateAdd.value.percent > 99) throw 'Tỷ lệ trong khoảng 1-99%'
    if(stateAdd.value.amount < 1) throw 'Số lượng phải lớn hơn 0'

    const data = JSON.parse(JSON.stringify(stateAdd.value))

    const check = list.value.find(i => i.item._id === data._id)
    if(!!check) throw 'Vật phẩm đã tồn tại'

    delete data['_id']
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
    if(!stateEdit.value.amount || !stateEdit.value.percent) throw 'Vui lòng nhập đầy đủ'
    if(stateEdit.value.amount < 1) throw 'Số lượng phải lớn hơn 0'
    if(stateEdit.value.percent < 1 || stateEdit.value.percent > 99) throw 'Tỷ lệ trong khoảng 1-99%'
    if(!list.value[stateEdit.value.index]) throw 'Chỉ mục vật phẩm sai'

    list.value[stateEdit.value.index].amount = stateEdit.value.amount
    list.value[stateEdit.value.index].percent = stateEdit.value.percent

    emit('update:modelValue', list.value)
    modal.value.edit = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const delAction = (index) => {
  try {
    if(!list.value[index]) throw 'Chỉ mục vật phẩm sai'
    list.value.splice(index, 1)

    emit('update:modelValue', list.value)
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

onMounted(() => {
  setTimeout(() => {
    list.value = props.modelValue
  }, 100)
})
</script>