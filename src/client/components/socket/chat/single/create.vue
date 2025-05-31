<template>
  <slot :create="create" :loading="loading"></slot>
</template>

<script setup>
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
    emits('done')
  }
  catch(e){
    loading.value = false
  }
}
</script>