<template>
  <UCard class="bg-gray relative" :ui="{ body: { padding: 'p-0 sm:p-0' }}">
    <UiFlex class="px-4 py-2 border-b border-gray-900 gap-1">
      <UiText size="sm" weight="semibold" class="mr-auto hidden md:block">Mốc Thời Gian</UiText>

      <SelectDate v-model="page.range.start" placeholder="Bắt đầu" size="md" />
      <SelectDate v-model="page.range.end" placeholder="Kết thúc" size="md" />
    </UiFlex>

    <div>
      <LoadingTable v-if="!!loading" />

      <UTable :columns="columns" :rows="list">
        <template #rank-data="{ row, index }">
          {{ index+1 }}
        </template>

        <template #value-data="{ row }">
          {{ useMoney().toMoney(row.value) }} Xu
        </template>
      </UTable>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps(['game'])

const list = ref([])

const columns = [
  {
    key: 'rank',
    label: 'Hạng',
  },{
    key: 'username',
    label: 'Tài khoản',
  },{
    key: 'value',
    label: 'Tổng tiêu'
  }
]
const loading = ref(true)
const page = ref({
  range: {
    start: null,
    end: null
  },
  total: 0,
  game: props.game?.code
})
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getRank()
  if(!val && !page.value.range.end) return getRank()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getRank()
  if(!val && !page.value.range.start) return getRank()
})

const getRank = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/project/rank/spend', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getRank, 1))
</script>