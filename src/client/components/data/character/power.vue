<template>
  <UiFlex justify="center" class="SVN gap-2">
    <UiIcon name="i-icomoon-free-power" size="6" color="yellow" class="relative top-0.5" />
    <UiText size="2xl">{{ useMoney().toMoney(displayNumber) }}</UiText>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['powers'])

const displayNumber = ref(0)
const duration = 800
const anim = ref()

const totalPower = computed(() => {
  if(!props.powers) return 0
  let total = 0
  for (const [type, value] of Object.entries(props.powers)) {
    total = total + (value['power'] + Math.floor((value['power'] * value['level']) / 2))
  }
  return total
})

const run = (from, to) => {
  const startTime = performance.now()

  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    displayNumber.value = Math.floor(from + (to - from) * progress)

    if (progress < 1) {
      anim.value = requestAnimationFrame(animate)
    } else {
      displayNumber.value = to
      if(!!anim.value) cancelAnimationFrame(anim.value)
    }
  }

  anim.value = requestAnimationFrame(animate)
}

watch(() => totalPower.value, (val) => {
  run(displayNumber.value, val)
})

onMounted(() => {
  if(totalPower.value > 0) run(0, totalPower.value)
})
onBeforeUnmount(() => {
  if(!!anim.value) cancelAnimationFrame(anim.value)
})
</script>