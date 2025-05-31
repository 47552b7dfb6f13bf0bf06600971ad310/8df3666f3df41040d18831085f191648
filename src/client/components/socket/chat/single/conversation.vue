<template>
  <UiFlex type="col" class="grow w-full overflow-hidden">
    <DataEmpty 
      text="Không có cuộc hội thoại nào" 
      :loading="loading.start" 
      class="grow w-full" 
      v-if="!!loading.start || list.length == 0"
    />

    <div class="HideScroll grow w-full gap-4 overflow-y-auto px-2" ref="box">
      <UiFlex 
        v-for="(item, index) in listFormat" :key="index" 
        class="w-full space-x-2 cursor-pointer my-4" 
        items="start"
        @click="socketStore.changeChatData('single', { now: item._id })"
      >
        <DataUserAvatar :user="item.to" size="sm" v-if="item.from._id == authStore.profile._id" no-level no-action />
        <DataUserAvatar :user="item.from" size="sm" v-else no-level no-action />

        <div class="grow">
          <DataUserName :user="item.to" size="xs" class="mb-1.5" v-if="item.from._id == authStore.profile._id" no-action />
          <DataUserName :user="item.from" size="xs" class="mb-1.5" v-else no-action />
          
          <UiFlex justify="between" class="gap-1 mb-1">
            <UiText size="sm" class="line-clamp-1 text-gray-400" :style="{ wordBreak: 'break-word' }" v-if="!item.last">Chưa có tin nhắn</UiText>

            <UiText 
              v-else
              size="sm" 
              class="line-clamp-1" 
              :style="{ wordBreak: 'break-word' }"
              :class="{
                'text-white font-semibold': item.last.user != authStore.profile._id && !item.last.isRead,
                'text-gray-400': (item.last.user == authStore.profile._id) || (item.last.user != authStore.profile._id && !!item.last.isRead)
              }"
            >
              {{ item.last.content }}
            </UiText>

            <UiText color="gray" class="leading-none whitespace-nowrap text-[0.7rem]" v-if="!!item.update">{{ useDayJs().fromTime(item.update) }}</UiText>
          </UiFlex>
        </div>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'

const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const box = ref()

const loading = ref({
  start: false,
  list: false
})
const list = ref([])
const page = ref({
  size: 20,
  skip: 0,
  total: 0
})

const listFormat = computed(() => {
  return list.value.sort((a,b) => {
    return new Date(b.update) - new Date(a.update);
  })
})

const getConversation = async (_id) => {
  if(!!loading.value.start) return
  if(!!loading.value.list) return

  const data = await useAPI('socket/public/chat/single/conversation/get', { _id: _id })
  if(!data) return

  const index = list.value.findLastIndex(item => item._id === data._id)
  if(index !== -1) return list.value[index]['last'] = data.last

  list.value.push(data)
  page.value.total = page.value.total + 1
  page.value.skip = list.value.length
}

const getLazy = async () => {
  try {
    loading.value.list = true

    const data = await useAPI('socket/public/chat/single/conversation/list', JSON.parse(JSON.stringify(page.value)))

    list.value = list.value.concat(data.list)
    page.value.total = data.total
    page.value.skip = list.value.length

    loading.value.list = false
  }
  catch(e){
    loading.value.list = false
  }
}

const getStart = async () => {
  try {
    loading.value.start = true
    const data = await useAPI('socket/public/chat/single/conversation/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    page.value.skip = list.value.length

    loading.value.start = false
    $socket.emit('chat-single-new')
  }
  catch(e){
    loading.value.start = false
  }
}

const { reset } = useInfiniteScroll(box, getLazy, { distance: 10, canLoadMore: () => {
  if(!!loading.value.start) return false
  if(!!loading.value.list) return false
  if(list.value.length >= page.value.total) return false
  return true
}})

watch(() => socketStore.chat.single.push.update, () => {
  if(!!loading.start) return

  const data = socketStore.chat.single.push.data
  const index = list.value.findLastIndex(item => item._id === data.conversation)

  if(index !== -1) return list.value[index]['last'] = data
  getConversation(data.conversation)
})

onMounted(() => {
  setTimeout(getStart, 1)
})
</script>