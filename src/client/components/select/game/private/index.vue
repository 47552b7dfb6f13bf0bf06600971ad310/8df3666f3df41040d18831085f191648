<template>
  <USelectMenu
    v-model="gameSelect"
    :searchable="searchGame"
    size="lg"
    by="_id"
    class="grow"
  >
    <template #label>
      <span v-if="select">{{ select.label }}</span>
      <span v-else>Tìm kiếm trò chơi</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: [ String, Array ],
  gameData: Object,
})

const emit = defineEmits(['update:modelValue', 'update:gameData'])
const gameSelect = ref(props.modelValue)
const select = ref(undefined)

watch(gameSelect, val => {
  select.value = val
  if(!!val) return emit('update:modelValue', val._id)
  emit('update:modelValue', undefined)
})

watch(select, val => {
  if(!val) return emit('update:gameData', undefined)
  emit('update:gameData', select.value)
})

const searchGame = async (key) => {
  const list = await useAPI('game/private/public/select', { key: key, _id: props.modelValue })

  if(!!props.modelValue && !select.value){
    const index = list.findLastIndex((i) => i._id == props.modelValue)
    if(index != -1){
      const game = list[index]
      select.value = { _id: game._id, label: game.name, code: game.code }
    }
  }

  return list.map(game => ({ _id: game._id, label: game.name, code: game.code })).filter(Boolean)
}
</script>