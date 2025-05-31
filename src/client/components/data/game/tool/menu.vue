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

  <UModal v-model="modal.recharge" :ui="{ width: 'sm:max-w-3xl' }">
    <DataGameToolRecharge :game="game" @close="modal.recharge = false" />
  </UModal>

  <UModal v-model="modal.mail" :ui="{ width: 'sm:max-w-3xl' }">
    <DataGameToolMail :game="game" @close="modal.mail = false" />
  </UModal>

  <UModal v-model="modal.rank" :ui="{ width: 'sm:max-w-3xl' }">
    <DataGameToolRank :game="game" @close="modal.rank = false" />
  </UModal>
</template>

<script setup>
const props = defineProps(['game'])
const authStore = useAuthStore()

const modal = ref({
  recharge: false,
  mail: false,
  rank: false
})


const tabs = [{
  label: 'Tool Nạp',
  icon: 'i-bi-lightning-charge-fill',
  click: () => {
    if(!authStore.isLogin) return authStore.setModal(true)
    modal.value.recharge = true
  }
},{
  label: 'Tool Thư',
  icon: 'i-mingcute-mail-send-fill',
  click: () => {
    if(!authStore.isLogin) return authStore.setModal(true)
    modal.value.mail = true
  }
},{
  label: 'Xếp Hạng',
  icon: 'i-bxs-bar-chart-alt-2',
  click: () => modal.value.rank = true
}]
</script>