<template>
  <slot :create="create" :loading="loading"></slot>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
const { width } = useWindowSize()

const socketStore = useSocketStore()
const loading = ref(false)
const emits = defineEmits(['done'])

const create = async (to) => {
  try {
    loading.value = true
    const conversation = await useAPI('socket/public/chat/single/conversation/create', { to: to })

    socketStore.changeChatData('single', { now: conversation })
    socketStore.changeTab('chat-single')
    if(width.value < 1024) socketStore.setSlideModal(true)
    loading.value = false
    emits('done')
  }
  catch(e){
    loading.value = false
  }
}
</script>