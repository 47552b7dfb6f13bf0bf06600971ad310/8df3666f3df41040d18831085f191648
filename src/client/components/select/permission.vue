<template>
  <UiFlex class="gap-0.5">
    <UBadge 
      variant="soft" class="cursor-pointer"
      :color="data.includes(100) ? 'rose' : 'gray'"
    >
      ADMIN
    </UBadge>

    <UBadge 
      variant="soft" class="cursor-pointer"
      :color="data.includes(3) ? 'green' : 'gray'"
      @click="toggle(3)"
    >
      S-MOD
    </UBadge>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  modelValue: { type: Array }
})
const emit = defineEmits(['update:modelValue'])

const data = ref([])

const toggle = (type) => {
  if(!!data.value.includes(type)){
    const index = data.value.findLastIndex(i => i == type)
    data.value.splice(index, 1)
  }
  else {
    data.value.push(type)
  }

  emit('update:modelValue', data)
}

onMounted(() => {
  data.value = props.modelValue || []
  if(!data.value.includes(100)) data.value.push(100)
  emit('update:modelValue', data)
})
</script>