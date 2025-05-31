<template>
  <div v-if="list.length > 0">
    <UCard class="bg-gray" :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
    }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list" :ui="{
        th: { padding: 'py-2' },
        td: { padding: 'py-2' },
      }">
        <template #code-data="{ row }">
          <UBadge @click="fast(row.code)" size="md" variant="soft" class="cursor-pointer">
            <UiText weight="bold" class="mr-1">{{ row.code }}</UiText>
            <UiIcon name="i-bx-copy" />
          </UBadge>
        </template>

        <template #gift-data="{ row }">
          <DataGamePrivateItemList :items="row.gift" :size="45" :game="game.code" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['fast'])

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'code',
    label: 'Mã',
  },{
    key: 'gift',
    label: 'Phần quà',
  }
]

const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  game: props.game.code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const fast = (code) => {
  emits('fast', code)
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/private/public/giftcode/public', JSON.parse(JSON.stringify(page.value)))

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>