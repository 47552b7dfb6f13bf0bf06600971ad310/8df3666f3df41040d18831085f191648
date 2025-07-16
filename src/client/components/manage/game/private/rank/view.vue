<template>
  <div>
    <UCard class="bg-gray" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="columns" :rows="list">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
        </template>

        <template #account-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.account }}</UBadge>
        </template>

        <template #value-data="{row}">
          {{ useMoney().toMoney(row.power || row.level) }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps(['fetchId', 'game'])

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'rank',
    label: 'Hạng'
  },{
    key: 'account',
    label: 'Tài khoản',
  },{
    key: 'role_name',
    label: 'Nhân vật',
  },{
    key: 'value',
    label: 'Chỉ số'
  }
]

// Page
const page = ref({
  fetchID: props.fetchId,
  game: props.game._id,
})

// Loading
const loading = ref({
  load: false,
  user: false
})

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/manage/rank/view', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>