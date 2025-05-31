<template>
  <div class="border border-gray-900 rounded-2xl relative">
    <LoadingTable v-if="loading" />

    <UTable :columns="selectedColumns" :rows="list">
      <template #[`commission.vip-data`]="{ row }">
        {{ row.commission.vip }}%
      </template>

      <template #[`commission.game.private-data`]="{ row }">
        {{ row.commission.game.private }}%
      </template>

      <template #[`commission.game.tool-data`]="{ row }">
        {{ row.commission.game.private }}%
      </template>

      <template #[`commission.game.china-data`]="{ row }">
        {{ row.commission.game.private }}%
      </template>

      <template #[`price-data`]="{ row }">
        {{ useMoney().toMoney(row.price) }} VNĐ
      </template>
    </UTable>
  </div>
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
    key: 'commission.vip',
    label: 'Hoa hồng Nâng VIP',
  },{
    key: 'commission.game.private',
    label: 'Hoa hồng Game Private'
  },{
    key: 'commission.game.tool',
    label: 'Hoa hồng Game Tool'
  },{
    key: 'commission.game.china',
    label: 'Hoa hồng Game China'
  },{
    key: 'price',
    label: 'Giá tham gia'
  }
]
const selectedColumns = ref([...columns])

// Loading
const loading = ref(true)
 
// Fetch
const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('collab/public/level/list')

    loading.value = false
    list.value = data
  }
  catch (e) {
    loading.value = false
  } 
}

getList()
</script>
