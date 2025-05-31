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
      <UiContent title="Nạp Xu" sub="Hệ thống nạp xu vào tài khoản" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false"></UButton>
        </template>

        <DataPaymentCreate :fast="true"/>
      </UiContent>
    </UModal>

    <!--Buy Tool-->
    <UModal v-model="modal.buy" prevent-close>
      <DataGameToolBuy :game="game" @close="modal.buy = false" @done="doneBuyTool"></DataGameToolBuy>
    </UModal>

    <!--Recharge-->
    <UModal v-model="modal.recharge" :ui="{ width: 'sm:max-w-3xl' }">
      <DataGameToolRecharge :game="game" @close="modal.recharge = false" />
    </UModal>

    <!--Mail-->
    <UModal v-model="modal.mail" preventClose :ui="{ width: 'sm:max-w-3xl' }">
      <DataGameToolMail :game="game" @close="modal.mail = false"  />
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
const route = useRoute()
const emits = defineEmits(['buyTool'])

const el = ref(null)
const dragging = ref(false)
const modal = ref({
  chat: false,
  payment: false,
  buy: false,
  recharge: false,
  mail: false,
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
    },{
      label: 'Mua Tool',
      icon: 'i-bx-shopping-bag',
      click: () => modal.value.buy = true,
    }],
    [{
      label: 'Nạp game',
      icon: 'i-bx-package',
      click: () => modal.value.recharge = true
    },{
      label: 'Gửi thư',
      icon: 'i-bx-mail-send',
      click: () => modal.value.mail = true
    }]
  ]

  const isMiniClient = localStorage.getItem('miniclient')
  if(!isMiniClient) list.push([{
    label: 'Thoát',
    icon: 'i-bx-log-out',
    click: () => useTo().navigateToSSL(`/game/tool/${props.game.key}`)
  }])

  return list
})


const doneBuyTool = (state) => {
  emits('buyTool', state)
  modal.value.buy = false
}
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