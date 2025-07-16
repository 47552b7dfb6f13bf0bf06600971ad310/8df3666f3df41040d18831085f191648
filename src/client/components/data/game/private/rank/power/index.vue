<template>
  <div>
    <UiFlex justify="between" class="mb-2">
      <UiTitle name="Chọn Máy Chủ" icon="i-bxs-server" /> 
      <SelectGameServer v-model="server" :game="game.code" type="private" size="md" auto />
    </UiFlex>

    <DataEmpty text="Vui lòng chọn máy chủ" class="min-h-[300px]" v-if="!server"></DataEmpty>

    <div v-else>
      <UiFlex>
        <UTabs v-model="tab" :items="tabItems"></UTabs>
      </UiFlex>

      <Transition name="page" mode="out-in">
        <DataGamePrivateRankPowerList v-if="tab === 0" :game="game" :server="server" />
        <DataGamePrivateRankPowerTop v-else-if="tab === 1" :game="game" :server="server" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const server = ref(null)

const tab = ref(0) 
const tabItems = [
  { label: 'Danh Sách' },
  { label: 'Đua TOP' }
]
</script>