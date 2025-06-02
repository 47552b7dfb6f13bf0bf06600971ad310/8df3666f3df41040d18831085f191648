<template>
  <UiContent title="User Level" sub="Quản lý cấp độ tài khoản">
    <!-- <UiFlex justify="end" class="mb-4">
      <UButton color="yellow" @click="modal.add = true">Thêm mới</UButton>
    </UiFlex> -->
    
    <!-- Table -->
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="selectedColumns" :rows="list">
        <template #title-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.title }}</UBadge>
        </template>

        <template #[`bonus.invite.payment-data`]="{ row }">
          {{ row.bonus.invite.payment }}%
        </template>

        <template #[`voucher.friend-data`]="{ row }">
          <span v-if="!row.voucher || (!!row.voucher && !row.voucher.friend)">...</span>
          <span v-else>[{{ row.voucher.friend.value }}] {{ row.voucher.friend.title }}</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Cấp">
          <UInput v-model="stateAdd.number" type="number" />
        </UFormGroup>

        <UFormGroup label="Danh hiệu">
          <UInput v-model="stateAdd.title" />
        </UFormGroup>

        <UFormGroup label="Tu vi">
          <UInput v-model="stateAdd.exp" type="number" />
        </UFormGroup>

        <UFormGroup label="Giới hạn chat">
          <UInput v-model="stateAdd.limit.chat" type="number" />
        </UFormGroup>

        <UFormGroup label="Giới hạn mời bạn">
          <UInput v-model="stateAdd.limit.invite" type="number" />
        </UFormGroup>

        <UFormGroup label="Thưởng ECoin mời">
          <UInput v-model="stateAdd.gift.invite" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn nạp thưởng ECoin">
          <UInput v-model="stateAdd.bonus.invite.payment" type="number" />
        </UFormGroup>

        <UFormGroup label="Thưởng nạp">
          <UInput v-model="stateAdd.bonus.payment" type="number" />
        </UFormGroup>

        <UFormGroup label="Giảm giá cửa hàng">
          <UInput v-model="stateAdd.discount.shop" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.add">Thêm</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Danh hiệu">
          <UInput v-model="stateEdit.title" />
        </UFormGroup>

        <UFormGroup label="Tu vi">
          <UInput v-model="stateEdit.exp" type="number" />
        </UFormGroup>

        <UFormGroup label="Chat thế giới">
          <UInput v-model="stateEdit.limit.chat" type="number" />
        </UFormGroup>

        <UFormGroup label="Giới hạn mời bạn">
          <UInput v-model="stateEdit.limit.invite" type="number" />
        </UFormGroup>

        <UFormGroup label="Thưởng ECoin mời">
          <UInput v-model="stateEdit.gift.invite" type="number" />
        </UFormGroup>

        <UFormGroup label="Bạn nạp thưởng ECoin">
          <UInput v-model="stateEdit.bonus.invite.payment" type="number" />
        </UFormGroup>

        <UFormGroup label="Voucher cho bạn bè">
          <SelectVoucherManage v-model="stateEdit.voucher.friend"  />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'number',
    label: 'Cấp',
  },{
    key: 'title',
    label: 'Danh hiệu',
  },{
    key: 'exp',
    label: 'Kinh nghiệm'
  },{
    key: 'limit.chat',
    label: 'Chat thế giới'
  },{
    key: 'limit.invite',
    label: 'Mời bạn'
  },{
    key: 'gift.invite',
    label: 'Thưởng ECoin mời'
  },{
    key: 'bonus.invite.payment',
    label: 'Bạn nạp +ECoin'
  },{
    key: 'voucher.friend',
    label: 'Voucher cho bạn bè'
  },{
    key: 'actions',
    label: 'Chức năng',
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
})

// State
const stateAdd = ref({
  title: null,
  number: null,
  exp: null,
  bonus: {
    payment: null,
    invite: {
      payment: null,
    }
  },
  limit: {
    chat: null,
    invite: null,
  },
  discount: {
    shop: null,
  },
  gift: {
    invite: null
  }
})
const stateEdit = ref({
  _id: null,
  title: null,
  number: null,
  exp: null,
  bonus: {
    payment: null,
    invite: {
      payment: null,
    }
  },
  limit: {
    chat: null,
    invite: null,
  },
  gift: {
    invite: null
  },
  voucher: {
    friend: null
  }
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  title: null,
  number: null,
  exp: null,
  bonus: {
    payment: null,
    invite: {
      payment: null,
    }
  },
  limit: {
    chat: null,
    invite: null,
  },
  discount: {
    shop: null,
  }
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false
})

// Actions
const actions = (row) => [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bxs-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.voucher = stateEdit.value.voucher ? stateEdit.value.voucher : {
        friend: null
      }
      stateEdit.value.voucher.friend = stateEdit.value.voucher.friend ? stateEdit.value.voucher.friend._id : null
      modal.value.edit = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/manage/level/list', JSON.parse(JSON.stringify(page.value)))

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
    await useAPI('user/manage/level/add', JSON.parse(JSON.stringify(stateAdd.value)))

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
    await useAPI('user/manage/level/edit', JSON.parse(JSON.stringify(stateEdit.value)))

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

getList()
</script>
