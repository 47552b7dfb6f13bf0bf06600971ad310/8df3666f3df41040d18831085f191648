<template>
  <UFormGroup label="Số tiền nạp lần 2">
    <UInput :model-value="useMoney().toMoney(need.payment.second)" readonly />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])

const need = ref({
  payment: {
    second: 0
  }
})

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>