<template>
  <div>
    <UFormGroup label="Chơi game Private">
      <SelectGamePrivate v-model="need.game.private.source" disabled />
    </UFormGroup>

    <UFormGroup label="Đạt cấp độ" v-if="need.game.private.level > 0">
      <UInput :model-value="useMoney().toMoney(need.game.private.level)" readonly />
    </UFormGroup>

    <UFormGroup label="Đạt lực chiến" v-if="need.game.private.power > 0">
      <UInput :model-value="useMoney().toMoney(need.game.private.power)" readonly />
    </UFormGroup>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const need = ref({
  game: {
    private: {
      source: null,
      level: null,
      power: null
    }
  }
})

onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>