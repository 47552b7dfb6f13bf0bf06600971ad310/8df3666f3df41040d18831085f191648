<template>
  <UiContent title="Lịch Sử" :sub="`Nhận thưởng từ ${invite.user?.username}`" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UiFlex class="mb-2 gap-1">
      <USelectMenu v-model="page.size" :disabled="!!loading.list" :options="[5,10,20,50,100]" />
    </UiFlex>

    <div class="bg-gray rounded-2xl relative" :class="{ 'min-h-[300px]' : !!loading }">
      <LoadingTable v-if="loading" />

      <UTable :columns="selectedColumns" :rows="list" v-else >
        <template #number-data="{ row }">
          <UiText color="primary" weight="semibold">{{ useMoney().toMoney(row.number) }}</UiText> 
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #reason-data="{ row }">
          <div v-html="row.reason" />
        </template>
      </UTable>
    </div>

    <UiFlex justify="end" class="mt-2">
      <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const props = defineProps(['invite', 'user'])
const emits = defineEmits(['close'])

// List
const list = ref([])
const loading = ref(true)

// Columns
const columns = [
  {
    key: 'createdAt',
    label: 'Thời gian',
    sortable: true
  },{
    key: 'number',
    label: 'ECoin nhận',
    sortable: true
  },{
    key: 'reason',
    label: 'Lý do'
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
  invite: props.invite._id,
  user: props.user
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// Fetch
const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('invite/public/list/reward', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(() => getList(), 1))
</script>