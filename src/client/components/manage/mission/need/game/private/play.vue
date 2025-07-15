<template>
  <div>
    <UFormGroup label="Game Private">
      <SelectGamePrivate v-model="need.game.private.source" v-model:gameData="game" />
    </UFormGroup>

    <UFormGroup label="Máy chủ" name="server" v-if="!!game && !!game.code">
      <SelectGameServer v-model="need.game.private.server" :game="game.code" type="private" />
    </UFormGroup>

    <UFormGroup label="Cấp độ yêu cầu">
      <UInput v-model="need.game.private.level" type="number" />
    </UFormGroup>

    <UFormGroup label="Lực chiến yêu cầu">
      <UInput v-model="need.game.private.power" type="number" />
    </UFormGroup>
  </div>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const game = ref()
const need = ref({
  game: {
    private: {
      source: null,
      server: null,
      level: null,
      power: null
    }
  }
})

watch(() => need.value.game.private.source, () => emit('update:modelValue', need.value))
watch(() => need.value.game.private.level, () => emit('update:modelValue', need.value))
watch(() => need.value.game.private.power, () => emit('update:modelValue', need.value))
onMounted(() => !!props.modelValue && (need.value = Object.assign(need.value, props.modelValue)))
</script>