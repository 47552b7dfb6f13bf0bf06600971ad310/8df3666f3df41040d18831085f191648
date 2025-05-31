<template>
  <UiFlex type="col" class="grow w-full overflow-hidden">
    <!-- Online -->
    <UiFlex class="w-full gap-2 p-2 border-b border-gray-800">
      <UiDot color="green" size="2" class="beat-anim" />
      <UiText size="sm" weight="semibold">Trực tuyến: </UiText>
      <UiText size="sm" weight="bold" color="green">{{ socketStore.online }}</UiText>

      <UButton icon="i-bxs-group" class="ml-auto" size="lg" variant="ghost" color="white" :padded="false" :loading="!!loading.list" />
    </UiFlex>

    <!-- Loading Start -->
    <DataEmpty 
      text="Chưa có hội thoại nào" 
      class="grow w-full" 
      :loading="loading.start" 
      v-if="!!loading.start || listFormat.length == 0" 
    />

    <!-- Messenger -->
    <div class="HideScroll grow w-full gap-4 overflow-y-auto px-2" ref="box">
      <UiFlex v-for="chat in listFormat" :key="chat._id" class="w-full my-4">
        <UiFlex class="w-full space-x-2" items="start">
          <DataUserAvatar :user="chat.user" size="md"/>
          
          <div class="text-left">
            <DataUserName :user="chat.user" class="mb-1.5" size="xs"/>

            <div class="inline-block bg-gray p-2 px-3 rounded-r-2xl rounded-bl-2xl text-left mb-2" :style="{ wordBreak: 'break-word' }">
              <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
            </div>

            <UiFlex>
              <UiText color="gray"  class="leading-none mx-2 text-[0.7rem]" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
              <UiText color="primary" class="leading-none mx-2 text-[0.7rem] cursor-pointer" mini @click="reply(chat.user)" v-if="!!authStore.isLogin">Trả lời</UiText>
              <UiText color="rose" class="leading-none mx-2 text-[0.7rem] cursor-pointer" mini @click="del(chat._id)" v-if="!!authStore.isAdmin">Xóa</UiText>
            </UiFlex>
          </div>
        </UiFlex>
      </UiFlex>
    </div>

    <!--Input-->
    <div class="w-full border-t border-gray-800 p-2 mt-auto">
      <UForm :state="state" @submit="send">
        <UiFlex>
          <UInput 
            v-model="state.text" 
            :disabled="!!loading.send || !authStore.isLogin"
            :loading="!!loading.send" 
            :ui="{ 
              padding: { md: 'pr-10' },
              color: { gray: { outline: 'ring-0 focus:ring-0 bg-gray' }} 
            }"
            color="gray"
            variant="outline"
            :placeholder="!!authStore.isLogin ? 'Nhập nội dung...' : 'Vui lòng đăng nhập trước'" 
            class="w-full" 
            size="md"
            id="InputChatGlobal"
            ref="input"
          >
          </UInput>

          <UiIcon 
            name="i-basil-send-solid" 
            color="primary" 
            class="cursor-pointer absolute right-4" 
            size="6" 
            :disabled="!!loading.send || !authStore.isLogin" 
            @click="send"
          ></UiIcon>
        </UiFlex>
      </UForm>
    </div>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const box = ref()
const input = ref()

const loading = ref({
  start: true,
  list: false,
  send: false
})

const list = ref([])
const page = ref({
  size: 20,
  skip: 0
})

const state = ref({
  text: null
})

const listFormat = computed(() => {
  return list.value.sort((a,b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
})

const toFocus = async () => {
  await nextTick()
  input.value.$refs.input.focus()
}

const toBottom = async () => {
  await nextTick()
  box.value.scrollTo({ top: box.value.scrollHeight, behavior: 'smooth' })
}

const toScroll = async (event) => {
  if (event.target.scrollTop === 0) {
    if(!!loading.value.list) return

    const scrollHeightBefore = box.value.scrollHeight
    await getLazy()

    const scrollHeightAfter = box.value.scrollHeight
    box.value.scrollTop = scrollHeightAfter - scrollHeightBefore
    box.value.removeEventListener('scroll', toScroll)
    box.value.addEventListener('scroll', toScroll)
  }
}

const reply = (user) => {
  state.value.text = `@${user.username} `
  toFocus()
}

const del = async (_id) => {
  await useAPI('socket/public/chat/global/del', { _id: _id })
}

const send = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước')
    if(!!loading.value.send) return useNotify().error('Vui lòng đợi tin nhắn trước đang được gửi')
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(state.value.text.length > 100) return useNotify().error('Nội dung không vượt quá 100 ký tự')

    loading.value.send = true
    $socket.emit('chat-global-send', JSON.parse(JSON.stringify(state.value)))

    state.value.text = null
    loading.value.send = false
    toFocus()
  }
  catch (e){
    loading.value.send = false
  }
}

const getLazy = async () => {
  try {
    if(!!loading.value.start) return

    loading.value.list = true
    const data = await useAPI('socket/public/chat/global/list', JSON.parse(JSON.stringify(page.value)))

    list.value = list.value.concat(data)
    page.value.skip = list.value.length
    
    setTimeout(() => loading.value.list = false, 500) 
  }
  catch {
    loading.value.list = false
  }
}

const getStart = async () => {
  try {
    loading.value.start = true
    const data = await useAPI('socket/public/chat/global/list', JSON.parse(JSON.stringify(page.value)))
    list.value = data
    page.value.skip = list.value.length
    
    loading.value.start = false 
    toBottom()
    box.value.addEventListener('scroll', toScroll)
  }
  catch {
    loading.value.start = false
  }
}

watch(() => socketStore.chat.global.push.update, () => {
  const data = socketStore.chat.global.push.data

  list.value.push(data)
  page.value.skip = list.value.length
  toBottom()
})

watch(() => socketStore.chat.global.del.update, () => {
  const data = socketStore.chat.global.del.data
  if(list.value.length == 0) return

  const index = list.value.findLastIndex(i => i._id == data)
  if(index < 0) return

  list.value.splice(index, 1)
  page.value.skip = list.value.length
})

onMounted(() => {
  setTimeout(getStart, 1)

  socketStore.changeChatData('global', { new: 0 })
})
</script>