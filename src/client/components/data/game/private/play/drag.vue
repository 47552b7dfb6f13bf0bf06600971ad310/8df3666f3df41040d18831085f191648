<template>
  <div>
    <div id="ButtonDrag" class="bg-gray-900 backdrop-blur-xl shadow-xl rounded-full touch-none ring-2 ring-primary" :style="style" ref="el">
      <UDropdown :items="listMenu" :popper="{ 
        placement: 'auto-end',
        strategy: 'absolute',
        scroll: 'true',
        offsetDistance: 14
      }">
        <img v-if="!!game.image.icon" :src="game.image.icon" class="w-full h-full rounded-full" />
        <UiIcon v-else name="i-bxs-customize" color="primary" size="8" />
      </UDropdown>
    </div>

    <div class="fixed bg-black/50 w-full h-full top-0 left-0" style="z-index: 99;" v-if="!!dragging"></div>

    <!--Payment-->
    <UModal v-model="modal.payment" preventClose>
      <UiContent title="Nạp Xu" sub="Hệ thống nạp xu vào tài khoản" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false"></UButton>
        </template>

        <DataPaymentCreate :fast="true"/>
      </UiContent>
    </UModal>

    <!--Giftcode-->
    <UModal v-model="modal.giftcode" preventClose>
      <DataGamePrivateGiftcode
        :game="game" 
        @close="modal.giftcode = false" 
        class="bg-card rounded-2xl p-4"
      /> 
    </UModal>

    <!--Shop-->
    <UModal v-model="modal.shop" preventClose :ui="{ width: 'sm:max-w-3xl' }">
      <DataGamePrivateShop :game="game" @close="modal.shop = false" />
    </UModal>

    <!--Event-->
    <UModal v-model="modal.event" preventClose :ui="{ width: 'sm:max-w-3xl' }">
      <DataGamePrivateEvent :game="game" @close="modal.event = false" />
    </UModal>

    <!--Chat-->
    <USlideover v-model="modal.chat" :ui="{ width: 'w-screen max-w-[330px]' }">
      <SocketNav v-if="!!modal.chat" class="h-full" has-close @close="modal.chat = false"/>
    </USlideover>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'

const props = defineProps(['game'])

const el = ref(null)
const dragging = ref(false)
const modal = ref({
  chat: false,
  payment: false,
  giftcode: false,
  shop: false,
  event: false
})

const { style } = useDraggable(el, {
  initialValue: { x: -10, y: -10 },
  exact: false,
  preventDefault: true,
  onStart: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const listMenu = computed(() => {
  const list = [
    [{
      label: 'Kênh Chat',
      icon: 'i-wpf-online',
      click: () => modal.value.chat = true,
    },{
      label: 'Nạp Xu',
      icon: 'i-bx-credit-card',
      click: () => modal.value.payment = true,
    }],
    [{
      label: 'Giftcode',
      icon: 'i-bx-barcode',
      click: () => modal.value.giftcode = true,
    },{
      label: 'Cửa Hàng',
      icon: 'i-bx-store',
      click: () => modal.value.shop = true,
    },{
      label: 'Sự Kiện',
      icon: 'i-bx-calendar',
      click: () => modal.value.event = true,
    }]
  ]

  const isMiniClient = localStorage.getItem('miniclient')
  if(!isMiniClient) list.push([{
    label: 'Thoát',
    icon: 'i-bx-log-out',
    click: () => useTo().navigateToSSL(`/game/private/${props.game.key}`)
  }])

  return list
})
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 45px
  min-height: 45px
  width: 45px
  height: 45px
  max-width: 45px
  max-height: 45px
  z-index: 100
  cursor: pointer
</style>