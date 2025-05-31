<template>
  <div class="border border-gray-900 rounded-2xl relative">
    <LoadingTable v-if="loading" />

    <UTable :columns="selectedColumns" :rows="list">
      <template #[`commission.vip-data`]="{ row }">
        <UiFlex class="gap-1">
          <UiText color="cyan">{{ row.commission.vip }}%</UiText>
        </UiFlex>
      </template>

      <template #[`commission.game.private-data`]="{ row }">
        <UiFlex class="gap-1">
          <UiText color="green">{{ row.commission.game.private }}%</UiText>
        </UiFlex>
      </template>

      <template #[`commission.game.tool-data`]="{ row }">
        <UiFlex class="gap-1">
          <UiText color="green">{{ row.commission.game.tool }}%</UiText>
        </UiFlex>
      </template>

      <template #[`commission.game.china-data`]="{ row }">
        <UiFlex class="gap-1">
          <UiText color="green">{{ row.commission.game.china }}%</UiText>
        </UiFlex>
      </template>

      <template #[`price-data`]="{ row }">
        <UiFlex class="gap-1">
          <UiText color="rose">{{ useMoney().toMoney(row.price) }}</UiText> VNĐ
        </UiFlex>
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
