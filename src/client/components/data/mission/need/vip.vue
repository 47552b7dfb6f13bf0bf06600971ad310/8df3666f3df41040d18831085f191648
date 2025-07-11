<template>
  <UFormGroup label="Yêu cầu VIP">
    <USelectMenu size="lg" placeholder="Chọn loại VIP" v-model="need.vip" :options="options" value-attribute="value" disabled />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])
const need = ref({
  vip: null
})

const options = [
  { label: 'VIP Tháng', value: 'month' },
  { label: 'VIP Trọn Đời', value: 'forever' },
]

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>