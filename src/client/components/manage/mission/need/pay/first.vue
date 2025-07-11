<template>
  <UFormGroup label="Số tiền nạp lần đầu">
    <UInput v-model="need.payment.first" type="number" />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const need = ref({
  payment: {
    first: 0
  }
})

watch(() => need.value.payment.first, () => emit('update:modelValue', need.value))

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>