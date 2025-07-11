<template>
  <UFormGroup label="Số tiền nạp">
    <UInput v-model="need.payment.money" />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const need = ref({
  payment: {
    money: 0
  }
})

watch(() => need.value.payment.money, () => emit('update:modelValue', need.value))

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>