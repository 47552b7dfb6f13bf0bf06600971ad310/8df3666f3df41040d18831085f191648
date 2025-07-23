<template>
  <UiFlex class="@container gap-1 md:gap-2 max-md:justify-center">
    <UiButtonSelect
      v-for="(item, index) in items" 
      @click="select = item.key"
      :active="!!select && select == item.key"
      class="p-4 grow @3xl:grow-0"
    >
      <UiFlex type="col">
        <UiIcon :name="item.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
        <UiText class="text-white text-xs md:text-sm" weight="bold" mini align="center">{{ item.label }}</UiText>
      </UiFlex>
    </UiButtonSelect>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  disabled: Boolean
})
const emit = defineEmits(['update:modelValue'])

const select = ref(props.modelValue)

const items = [
  { key: 'private', label: 'Game Private', icon: 'i-fluent-games-28-filled' },
  { key: 'tool', label: 'Game Tool', icon: 'i-ion-game-controller' },
  // { key: 'china', label: 'Game China', icon: 'i-jam-gamepad-f' }
]

watch(() => select.value, (val) => emit('update:modelValue', select.value))
</script>