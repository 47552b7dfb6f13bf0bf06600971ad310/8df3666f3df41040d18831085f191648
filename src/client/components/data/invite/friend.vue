<template>
  <div class="mt-2">
    <UiFlex class="mb-4 gap-1">
      <USelectMenu v-model="page.size" :disabled="!!loading.list" :options="[5,10,20,50,100]" size="md"/>
      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="md" :disabled="!!loading.list" />
      </UForm>

      <DataInviteViewCode class="ml-auto" />
    </UiFlex>

    <UCard :ui="{ body: { padding: '!p-0' }}">
      <LoadingTable v-if="!!loading.list" />

      <UTable :columns="selectedColumns" :rows="list">
        <template #user-data="{ row }">
          <div class="min-w-[140px]">
            <DataUserName no-guild :user="row.user" size="md" class="!text-gray-100" />
          </div>
        </template>

        <template #payment-data="{ row }">
          {{ useMoney().toMoney(row.payment) }}
        </template>

        <template #reward-data="{ row }">
          <UButton color="green" variant="link" :padded="false" @click="viewReward(row)">
            + {{ useMoney().toMoney(row.reward) }}
          </UButton>
        </template>

        <template #['receive.invitation-data']="{ row }">
          <UBadge 
            v-if="!row.receive.invitation && row.payment >= 20000"  
            size="sm"
            variant="soft"
            class="cursor-pointer"
            @click="receiveInvitation(row)"
          >
            Bấm Nhận
          </UBadge>

          <UBadge v-else :color="!row.receive.invitation ? 'gray' : 'green'" size="sm" variant="soft">
            {{ !row.receive.invitation ? 'Chưa thể nhận' : 'Đã nhận' }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end" class="mt-2">
      <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <UModal v-model="modal.reward" :ui="{width: 'sm:max-w-[900px]'}">
      <DataInviteViewReward :invite="select" @close="modal.reward = false"/>
    </UModal>
  </div>
</template>

<script setup>
// List
const list = ref([])
const select = ref()

// Columns
const columns = [
  {
    key: 'user',
    label: 'Bạn bè',
  },{
    key: 'payment',
    label: 'Tổng nạp',
    sortable: true
  },{
    key: 'reward',
    label: 'ECoin nhận',
    sortable: true
  },{
    key: 'receive.invitation',
    label: 'Quà mời',
    sortable: true
  },{
    key: 'createdAt',
    label: 'Ngày bắt đầu',
    sortable: true
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
  search: '',
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && (page.value.current = 1) && getList())

// Modal
const modal = ref({
  reward: false
})

// Loading
const loading = ref({
  list: true,
  receive: {
    invitation: false
  }
})

const viewReward = (invite) => {
  select.value = invite
  modal.value.reward = true
}
 
// Fetch
const receiveInvitation = async (invite) => {
  try {
    const { error } = useNotify()
    if(!!loading.value.receive.invitation) return error('Vui lòng đợi tiến trình cũ kết thúc')
    if(invite.payment < 20000) return error('Bạn bè phải nạp tối thiểu 20.000 VNĐ thì bạn mới được nhận')

    loading.value.receive.invitation = true
    await useAPI('invite/public/receive/invitation', { invite: invite._id })

    loading.value.receive.invitation = false
    getList()
  }
  catch (e) {
    loading.value.receive.invitation = false
  } 
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('invite/public/list/friend', JSON.parse(JSON.stringify(page.value)))

    loading.value.list = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.list = false
  } 
}

getList()
</script>