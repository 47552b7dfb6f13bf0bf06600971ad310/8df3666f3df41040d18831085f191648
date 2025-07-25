<template>
  <div class="w-full h-full" v-if="!!verify && !!game">
    <iframe title="Playing Game" :src="verify.url" width="100%" height="100%" class="Iframe"></iframe>

    <DataGamePrivatePlayDrag :game="game" />

    <UModal v-model="modal.recharge">
      <DataGamePrivateShopRechargeBuy
        :game="game"
        :recharge="selectRecharge.recharge"
        :server="selectRecharge.server"
        @close="modal.recharge = false" 
        @done="doneRecharge" 
      />
    </UModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'play',
  middleware: 'auth'
})

const authStore = useAuthStore()
const gameStore = useGameStore()
const route = useRoute()
const loading = ref(false)
const game = ref(undefined)
const verify = ref(undefined)

const modal = ref({
  recharge: false
})

const selectRecharge = ref({
  recharge: null,
  server: null
})

const onRecharge = async (detail) => {
  try {
    if(!detail.item_id || !detail.item_name || !detail.price) return
    const send = JSON.parse(JSON.stringify(detail))
    send.game = route.query.game

    const data = await useAPI('game/private/public/project/shop/recharge/check', JSON.parse(JSON.stringify(send)))
    selectRecharge.value.recharge = data.recharge
    selectRecharge.value.server = data.server
    modal.value.recharge = true
  }
  catch (e) {
    return
  }
}

const onMessage = (e) => {
  const detail = e.data
  if(!detail) return
  onRecharge(detail)
}

const doneRecharge = async (data) => {
  modal.value.recharge = false
  await getUser()

  const iframe = document.querySelector("iframe")
  iframe.contentWindow.postMessage(JSON.stringify(data), "*")
}

onMounted(() => {
  window.addEventListener('message', onMessage, false)
})

onBeforeRouteLeave(() => {
  window.removeEventListener('message', onMessage, false)
})

const verifyGame = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/project/play/verify', JSON.parse(JSON.stringify(route.query)))
    verify.value = data

    await getGame()
  }
  catch(e){
    return false
  }
}

const getGame = async () => {
  try {
    loading.value = true
    const gameData = await useAPI('game/private/public/project/key', { 
      key: verify.value.key 
    })
    game.value = gameData

    await getUser()
    loading.value = false
  }
  catch(e){
    return false
  }
}

const getUser = async () => {
  try {
    const data = await useAPI('game/private/public/project/user/get', {
      game: game.value.code
    })

    game.value.user = data
    await authStore.setAuth()
  }
  catch(e){
    return false
  }
}

watch(() => gameStore.action.private.shop.buy, (val) => getUser())
watch(() => gameStore.action.private.event.receive, (val) => getUser())
onMounted(() => setTimeout(verifyGame, 1))
</script>