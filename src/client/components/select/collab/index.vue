<template>
  <USelectMenu
    v-model="collabSelect"
    :searchable="search"
    size="lg"
    by="_id"
    class="grow"
  >
    <template #label>
      <span v-if="select">{{ select.label }}</span>
      <span v-else>Tìm kiếm mã cộng tác viên</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const props = defineProps({
  modelValue: [ String, Array ],
  colabData: Object,
})

const emit = defineEmits(['update:modelValue', 'update:colabData'])
const collabSelect = ref(props.modelValue)
const select = ref(undefined)

watch(collabSelect, val => {
  select.value = val
  if(!!val) return emit('update:modelValue', val._id)
  emit('update:modelValue', undefined)
})

watch(select, val => {
  if(!val) return emit('update:colabData', undefined)
  emit('update:colabData', { _id: val._id, name: val.label })
})

const search = async (key) => {
  const list = await useAPI('collab/manage/select', { key: key, _id: props.modelValue })

  if(!!props.modelValue && !select.value){
    const index = list.findLastIndex((i) => i._id == props.modelValue)
    if(index != -1){
      const collab = list[index]
      select.value = { _id: collab._id, label: `[${collab.code}] - ${collab.link}` }
    }
  }

  return list.map(collab => ({ _id: collab._id, label: `[${collab.code}] - ${collab.link}` })).filter(Boolean)
}
</script>