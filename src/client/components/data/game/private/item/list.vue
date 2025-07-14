<template>
  <UiFlex wrap :justify="justify" class="gap-1">
    <UiText size="xs" color="gray" v-if="!items || list.length == 0">{{empty || 'Không có phần thưởng'}}</UiText>
    <DataGamePrivateItem v-for="(data, index) in list" :key="index" :item="data.item" :amount="data.amount" :size="size" :game="game" />
  </UiFlex>
</template>

<script setup>
const props = defineProps(['items', 'empty', 'justify', 'size', 'max', 'game'])

const list = computed(() => {
  if(!props.max) return props.items

  const format = []
  for (let i = 0; i < props.max; i++) {
    if(props.items[i]) format.push(props.items[i])
  }
  return format
})
</script>