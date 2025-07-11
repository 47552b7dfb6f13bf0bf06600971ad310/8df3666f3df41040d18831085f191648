<template>
  <UiFlex class="SVN gap-2 w-full">
    <UiIcon name="i-icomoon-free-power" size="6" color="yellow" class="relative top-0.5" />
    <UiText size="xl">Lực chiến</UiText>
    <UiText size="2xl" color="yellow" class="ml-auto">
      <UiNumber :num="totalPower">
        <template #default="{ display }">
          {{ useMoney().toMoney(display) }}
        </template>
      </UiNumber>
    </UiText>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['powers'])

const totalPower = computed(() => {
  if(!props.powers) return 0
  let total = 0
  for (const [type, value] of Object.entries(props.powers)) {
    total = total + (value['power'] + Math.floor((value['power'] * value['level']) / 2))
  }
  return total
})
</script>