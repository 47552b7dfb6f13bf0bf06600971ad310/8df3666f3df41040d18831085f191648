<template>
  <UFormGroup label="Mua Tool trò chơi">
    <SelectGameTool v-model="need.game.tool.source" disabled />
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

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>