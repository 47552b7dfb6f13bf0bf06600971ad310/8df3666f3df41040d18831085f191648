<template>
  <UFormGroup label="Yêu cầu cảnh giới">
    <SelectLevel v-model="need.level" />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const need = ref({
  level: null
})

watch(() => need.value.level, () => emit('update:modelValue', need.value))
onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>