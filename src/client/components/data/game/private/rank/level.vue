<template>
  <UCard class="bg-gray relative" :ui="{ body: { padding: 'p-0 sm:p-0' }}">
    <UiFlex class="px-4 py-2 border-b border-gray-900" justify="between">
      <UiText size="sm" weight="semibold">Máy chủ</UiText>
      <SelectGameServer v-model="state.server_id" :game="game.code" type="private" size="md" auto />
    </UiFlex>

    <LoadingTable v-if="!!loading" />

    <UTable :columns="columns" :rows="list">
      <template #level-data="{ row }">
        {{ useMoney().toMoney(row.level) }}
      </template>
    </UTable>
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
    key: 'role_name',
    label: 'Nhân vật',
  },{
    key: 'level',
    label: 'Cấp độ'
  }
]
const loading = ref(false)
const state = ref({
  server_id: null,
  game: props.game.code
})
watch(() => state.value.server_id, (val) => !!val && getRank())

const getRank = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/project/rank/level', JSON.parse(JSON.stringify(state.value)))

    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}
</script>