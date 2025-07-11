<template>
  <UiContent title="Cửa Hàng" sub="Mua vật phẩm gửi vào game" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UiFlex class="mb-2 gap-1 md:gap-2">
      <UiButtonSelect
        v-for="(item, index) in tabs" :key="index"
        class="p-4 md:min-w-[130px] min-w-auto grow md:grow-0"
        :active="tab == item.key"
        @click="tab = item.key"
      >
        <UiFlex type="col">
          <UiIcon :name="item.icon" class="h-6 w-6 md:h-8 md:w-8 mb-1" />
          <UiText mini class="text-white text-xs md:text-sm" weight="bold">{{ item.label }}</UiText>
        </UiFlex>
      </UiButtonSelect>
    </UiFlex>

    <div>
      <DataGamePrivateShopRecharge :game="game" v-if="tab == 'recharge'" @done="updatePrivateShopBuy"/>
      <DataGamePrivateShopItem :game="game" v-if="tab == 'item'" @done="updatePrivateShopBuy" />
      <DataGamePrivateShopPack :game="game" v-if="tab == 'pack'" @done="updatePrivateShopBuy" />
    </div>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close', 'done'])

const tabs = computed(() => {
  const list = []
  if(!props.game.paygame){
    list.push({ label: 'Nạp Game', icon: 'i-bi-lightning-charge-fill', key: 'recharge' })
    list.push({ label: 'Vật Phẩm', icon: 'i-uim-box', key: 'item' })
    list.push({ label: 'Gói Vật Phẩm', icon: 'i-fluent-box-28-filled', key: 'pack' })
  }
  else {
    list.push({ label: 'Vật Phẩm', icon: 'i-uim-box', key: 'item' })
    list.push({ label: 'Gói Vật Phẩm', icon: 'i-fluent-box-28-filled', key: 'pack' })
  }
  return list
})
const tab = ref(tabs.value[0]['key'])
</script>