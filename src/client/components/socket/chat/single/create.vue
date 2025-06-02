<template>
  <slot :create="create" :loading="loading"></slot>
</template>

<script setup>
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 430 })
const isLG = breakpoints.greaterOrEqual('lg')
const isXL = breakpoints.greaterOrEqual('xl')
const socketStore = useSocketStore()
const loading = ref(false)
const emits = defineEmits(['done'])

const create = async (to) => {
  try {
    loading.value = true
    const conversation = await useAPI('socket/public/chat/single/conversation/create', { to: to })
    socketStore.changeChatData('single', { now: conversation })
    socketStore.changeTab('chat-single')
    
    loading.value = false
    if(!isLG.value) socketStore.setSlideModal(true)
    emits('done')
  }
  catch(e){
    loading.value = false
  }
}
</script>