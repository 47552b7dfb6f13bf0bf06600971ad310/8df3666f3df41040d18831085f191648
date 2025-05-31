<template>
  <Transition name="slide-fade">
    <UiFlex class="NotifyGlobal w-full md:w-auto md:!max-w-[400px]" justify="center" v-if="!!isRunning">
      <DataUserNotify class="!inline-flex" :user="select.user" v-if="!!select">
        <SocketNotifyGlobalText :message="select.content" class="grow" @end="end" :key="update" />
      </DataUserNotify>
    </UiFlex>
  </Transition>
</template>

<script setup>
const socketStore = useSocketStore()

const list = ref([])
const length = computed(() => list.value.length)
const select = ref(null)
const update = ref(0)
const isRunning = ref(false)

const start = () => {
  if (list.value.length == 0) select.value = null
  else select.value = list.value[0]

  update.value = update.value + 1
  isRunning.value = true
} 

const end = () => {
  isRunning.value = false
  
  setTimeout(() => {
    list.value.shift()
    select.value = null
    start()
  }, 1000)
}

watch(() => socketStore.notify.global.push.update, () => {
  const data = socketStore.notify.global.push.data
  list.value.push(data)
})

watch(() => length.value, () => !select.value && start())
</script>

<style lang="sass">
.NotifyGlobal
  position: fixed
  top: calc(var(--header-size) + 10px)
  left: 50%
  z-index: 5
  transform: translate(-50%)
  max-width: calc(100vw - 64px)
  .UserName
    box-shadow: 0 2px 8px 1px #000000bf

.slide-fade-enter-active 
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1)
.slide-fade-leave-active
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1)
.slide-fade-enter-from, .slide-fade-leave-to
  transform: translateX(20px)
  opacity: 0
</style>