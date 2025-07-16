<template>
  <div>
    <DataEmpty :loading="loading" text="Chưa có sự kiện đua TOP ở máy chủ này" class="min-h-[300px]" v-if="!!loading || !process"></DataEmpty>

    <div v-else>
      <UiText align="center" color="gray" size="sm" class="px-8">
        Kết thúc ngày <span class="text-rose-400 font-semibold">{{ useDayJs().displayFull(process.end) }} </span> 
      </UiText>

      <UCard class="bg-gray mt-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }" >
        <UTable :columns="columns" :rows="process.award" v-model:sort="sort">
          <template #rank-data="{ row }">
            <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
          </template>

          <template #gift-data="{ row }">
            <DataGamePrivateItemList :items="row.gift" :game="game.code" />
          </template>
        </UTable>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['game', 'server'])
const loading = ref(true)

// List
const process = ref(null)

// Columns
const columns = [
  {
    key: 'rank',
    label: 'Hạng'
  },{
    key: 'gift',
    label: 'Phần thưởng',
  }
]

const getProcess = async () => {
  try {
    loading.value = true
    const game = props.game.code
    const server = props.server
    const data = await useAPI('game/private/public/project/rank/level/top', { game, server })

    process.value = data
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

watch(() => props.server, () => getProcess())
onMounted(() => setTimeout(getProcess, 1))
</script>