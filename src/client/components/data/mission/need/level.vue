<template>
  <UFormGroup label="Yêu cầu cảnh giới">
    <SelectLevel v-model="need.level" disabled />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])

const need = ref({
  level: null
})

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>