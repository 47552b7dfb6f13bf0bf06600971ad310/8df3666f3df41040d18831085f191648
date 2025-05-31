<template>
  <UiFlex class="gap-1 md:gap-2 py-1" justify="center">
    <UiButtonSelect
      v-for="(item, index) in tabs" :key="index"
      class="p-4 grow"
      active
      @click="item.click()"
    >
      <UiFlex type="col">
        <UiIcon :name="item.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
        <UiText class="text-white text-xs md:text-sm" weight="bold">{{ item.label }}</UiText>
      </UiFlex>
    </UiButtonSelect>
  </UiFlex>

  <UModal v-model="modal.shop" preventClose :ui="{ width: 'sm:max-w-3xl' }">
    <DataGamePrivateShop :game="game" @close="modal.shop = false" />
  </UModal>

  <UModal v-model="modal.event" preventClose :ui="{ width: 'sm:max-w-3xl' }">
    <DataGamePrivateEvent :game="game" @close="modal.event = false" />
  </UModal>

  <UModal v-model="modal.rank" preventClose :ui="{ width: 'sm:max-w-3xl' }">
    <DataGamePrivateRank :game="game" @close="modal.rank = false" />
  </UModal>
</template>

<script setup>
const props = defineProps(['game'])

const modal = ref({
  shop: false,
  event: false,
  rank: false
})

const tabs = [{
  label: 'Cửa Hàng',
  icon: 'i-bxs-store',
  click: () => modal.value.shop = true
},{
  label: 'Sự Kiện',
  icon: 'i-bxs-calendar',
  click: () => modal.value.event = true
},{
  label: 'Xếp Hạng',
  icon: 'i-bxs-bar-chart-alt-2',
  click: () => modal.value.rank = true
}]
</script>