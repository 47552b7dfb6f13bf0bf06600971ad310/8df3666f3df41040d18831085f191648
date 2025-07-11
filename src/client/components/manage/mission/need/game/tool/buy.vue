<template>
  <UFormGroup label="Game Tool">
    <SelectGameTool v-model="need.game.tool.source" />
  </UFormGroup>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const need = ref({
  game: {
    tool: {
      source: null,
    }
  }
})

watch(() => need.value.game.tool.source, () => emit('update:modelValue', need.value))
onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>