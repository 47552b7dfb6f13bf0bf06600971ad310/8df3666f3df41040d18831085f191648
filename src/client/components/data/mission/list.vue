<template>
  <div>
    <UiFlex class="mb-4" justify="between">
      <UiTitle name="Danh Sách" icon="i-material-symbols-light-other-admission" />

      <UButton icon="i-bxs-time" color="gray" @click="modal.history = true">Xem Lịch Sử</UButton>
    </UiFlex>

    <DataEmpty :loading="loading.list" text="Hiện tại chưa có nhiệm vụ nào" class="min-h-[300px]" v-if="!!loading.list || list.length == 0" />
    
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0'}}" class="bg-gray-1000 mb-2" v-else>
      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #name-data="{ row }">
          <UiText weight="semibold" color="gray" class="min-w-[150px] max-w-[200px] block whitespace-normal">{{ row.name }}</UiText>
        </template>

        <template #ecoin-data="{ row }">
          <UiText weight="semibold" color="green">+ {{ toMoney(row.ecoin) }}</UiText>
        </template>

        <template #expired-data="{ row }">
          {{ row.expired ? useDayJs().displayFull(row.expired) : 'Không giới hạn' }}
        </template>

        <template #active-data="{ row }">
          <UButton 
            :color="row.active.color"
            :disabled="row.active.status == 1"
            :class="{ 'color-blue-light bg-anim-light' : row.active.status == 0 }"
            size="xs"
            @click="openReceive(row)"
          >{{ row.active.label }}</UButton>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <UModal v-model="modal.history" :ui="{width: 'sm:max-w-[900px]'}" prevent-close>
      <UiContent title="Lịch Sử" sub="Danh sách các nhiệm vụ đã hoàn thành" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history = false"></UButton>
        </template>
        
        <DataMissionHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.receive" prevent-close>
      <UiContent :title="missionSelect.name" sub="Trình nhận thưởng nhiệm vụ" class="bg-card rounded-2xl p-4" v-if="!!missionSelect">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.receive = false"></UButton>
        </template>
        
        <UForm @submit="receive">
          <div class="mb-4">
            <DataMissionNeedPayFirst v-model="missionSelect.need" v-if="missionSelect.type == 'pay.first'" />
            <DataMissionNeedPaySecond v-model="missionSelect.need" v-if="missionSelect.type == 'pay.second'" />
            <DataMissionNeedPaySuccess v-model="missionSelect.need" v-if="missionSelect.type == 'pay.success'" />
            <DataMissionNeedVip v-model="missionSelect.need" v-if="missionSelect.type == 'vip.upgrade'" />
            <DataMissionNeedLevel v-model="missionSelect.need" v-if="missionSelect.type == 'level.up'" />
            <DataMissionNeedGamePrivatePlay v-model="missionSelect.need" v-if="missionSelect.type == 'game.private.play'" />
            <DataMissionNeedGameToolBuy v-model="missionSelect.need" v-if="missionSelect.type == 'game.tool.buy'" />
          </div>

          <UFormGroup label="Phần thưởng">
            <UInput :model-value="toMoney(missionSelect.ecoin) + ' ECoin'" readonly />
          </UFormGroup>

          <UFormGroup label="Thời gian hết hạn" v-if="!!missionSelect.expired">
            <UInput :model-value="useDayJs().displayFull(missionSelect.expired)" readonly />
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton type="submit" :loading="loading.receive" color="yellow" size="md">Nhận</UButton>
            <UButton color="gray" :disabled="loading.receive" size="md" @click="modal.receive = false">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const { toMoney } = useMoney()

const list = ref([])

const missionSelect = ref(null)

const loading = ref({
  list: true,
  receive: false
})

const modal = ref({
  history: false,
  receive: false
})

const columns = [
  {
    key: 'name',
    label: 'Nhiệm vụ',
  },{
    key: 'ecoin',
    label: 'Phần thưởng ECoin',
    sortable: true
  },{
    key: 'expired',
    label: 'Hết hạn',
    sortable: true
  },{
    key: 'active',
    label: 'Trạng thái'
  }
]

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

const openReceive = (mission) => {
  missionSelect.value = mission
  modal.value.receive = true
}

const receive = async () => {
  try {
    if(!missionSelect.value) return useNotify().error('Vui lòng chọn nhiệm vụ trước')
    if(!missionSelect.value._id) return useNotify().error('ID nhiệm vụ không tồn tại')

    loading.value.receive = true
    const post = JSON.parse(JSON.stringify(missionSelect.value))
    await useAPI('mission/public/receive', { _id: post._id })

    loading.value.receive = false
    modal.value.receive = false
    getList()
	}
	catch(e){
    loading.value.receive = false
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('mission/public/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.list = false
  }
  catch(e){
    loading.value.list = false
  }
}

getList()
watch(() => authStore.isLogin, (val) => getList())
</script>