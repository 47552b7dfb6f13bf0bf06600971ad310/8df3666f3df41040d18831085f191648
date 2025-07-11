<template>
  <UFormGroup label="Số tiền nạp">
    <UInput :model-value="useMoney().toMoney(need.payment.money)" readonly />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])

const need = ref({
  payment: {
    money: 0
  }
})

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>