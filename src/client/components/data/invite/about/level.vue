<template>
  <div class="border border-gray-900 rounded-2xl relative">
    <LoadingTable v-if="loading" />

    <UTable :columns="selectedColumns" :rows="list">
      <template #number-data="{ row }">
        <UBadge :class="`UserName user-level-${row.number > 10 ? 10 : row.number} bg-user-level-process !text-white`">{{ row.title }}</UBadge>
      </template>

      <template #exp-data="{ row }">
        {{ useMoney().toMoney(row.exp) }}
      </template>

      <template #[`limit.chat-data`]="{ row }">
        {{ row.limit.chat }} lần / ngày
      </template>

      <template #[`limit.invite-data`]="{ row }">
        {{ row.limit.invite }} bạn
      </template>

      <template #[`gift.invite-data`]="{ row }">
        {{ row.gift.invite }} ECoin
      </template>

      <template #[`bonus.invite.payment-data`]="{ row }">
        {{ row.bonus.invite.payment }}% tiền nạp
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
    key: 'exp',
    label: 'Kinh nghiệm'
  },{
    key: 'limit.chat',
    label: 'Chat thế giới'
  },{
    key: 'limit.invite',
    label: 'Mời tối đa'
  },{
    key: 'gift.invite',
    label: 'Mời bạn tặng'
  },{
    key: 'bonus.invite.payment',
    label: 'Bạn nạp tặng ECoin'
  }
]
const selectedColumns = ref([...columns])

// Loading
const loading = ref(true)
 
// Fetch
const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('user/public/level/list')

    loading.value = false
    list.value = data
  }
  catch (e) {
    loading.value = false
  } 
}

getList()
</script>
