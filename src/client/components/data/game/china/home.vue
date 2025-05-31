<template>
  <div class="@container">
    <UiFlex justify="between" class="gap-2 mb-2" wrap>
      <NuxtLink to="/game/china">
        <UiTitle name="Game China" icon="i-jam-gamepad-f" />
      </NuxtLink>

      <UButton icon="i-bxs-chevrons-right" color="gray" to="/game/china" class="@2xl:hidden">Xem thêm</UButton>
      <UTabs :items="items" @change="onChange" class="space-y-0 w-full @2xl:w-auto"/>
    </UiFlex>

    <DataGameChinaListSort sort="createdAt" v-if="selected == 1"/>
    <DataGameChinaListSort sort="statistic.play" v-if="selected == 2" />
    <DataGameChinaListSort sort="statistic.user" v-if="selected == 3" />
  </div>
</template>

<script setup>
const selected = ref(1)
const items = [
  { label: 'Mới Nhất', value: 1, icon: 'i-lsicon-badge-new-filled' },
  { label: 'Top Game', value: 2, icon: 'i-ph-ranking-bold' },
  { label: 'Game HOT', value: 3, icon: 'i-bxs-hot'},
]
const onChange = (index) => selected.value = index + 1
const selectedData = computed(() => items[selected.value-1])
</script>