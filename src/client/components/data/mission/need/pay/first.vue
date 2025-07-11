<template>
  <UFormGroup label="Số tiền nạp lần đầu">
    <UInput :model-value="useMoney().toMoney(need.payment.first)" readonly />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])

const need = ref({
  payment: {
    first: 0
  }
})

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>