<template>
  <UFormGroup label="Số tiền nạp lần 2">
    <UInput v-model="need.payment.second" />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const need = ref({
  payment: {
    second: 0
  }
})

watch(() => need.value.payment.second, () => emit('update:modelValue', need.value))

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>