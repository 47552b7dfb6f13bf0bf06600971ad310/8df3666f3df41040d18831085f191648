<template>
  <UiFlex type="col" class="grow w-full overflow-hidden">
    <!--User Info-->
    <UiFlex class="w-full space-x-2 p-2 border-b border-gray-800" v-if="!!conversation">
      <DataUserAvatar :user="conversation.to" size="sm" no-level v-if="conversation.from._id == authStore.profile._id" />
      <DataUserAvatar :user="conversation.from" size="sm" no-level v-else />

      <UiFlex class="grow" justify="between">
        <div>
          <DataUserName :user="conversation.to" size="xs" class="mb-2" v-if="conversation.from._id == authStore.profile._id" />
          <DataUserName :user="conversation.from" size="xs" class="mb-2" v-else />

          <UiText class="text-xs select-none" weight="semibold" :color="conversation.to.online ? 'green' : 'rose'" v-if="conversation.from._id == authStore.profile._id">
            {{ conversation.to.online ? 'Online' : 'Offline' }}
          </UiText>
          <UiText class="text-xs select-none" weight="semibold" :color="conversation.from.online ? 'green' : 'rose'" v-else>
            {{ conversation.from.online ? 'Online' : 'Offline' }}
          </UiText>
        </div>

        <UButton @click="close" icon="i-bx-x" size="lg" variant="none" :padded="false" :loading="!!loading.list || !!loading.start" />
      </UiFlex>
    </UiFlex>

    <!-- Loading Start -->
    <DataEmpty 
      text="Chưa có tin nhắn nào" 
      class="grow w-full" 
      :loading="loading.start" 
      v-if="!!loading.start || listFormat.length == 0" 
    />

    <!-- Messenger -->
    <div class="HideScroll grow w-full overflow-y-auto px-2" ref="box">
      <div v-for="(group, i) in listFormat" :key="`group-${i}`" class="py-4">
        <UiFlex justify="center" class="mb-1">
          <UiText color="gray" size="xs">{{ useDayJs().displayFull(group.start) }}</UiText>
        </UiFlex>

        <UiFlex 
          v-for="(message, o) in group.messages" 
          :key="`group-${i}-message-${o}`" 
          :justify="authStore.profile._id == message.user ? 'end' : 'start'"
          class="py-[1.5px]"
        >
          <!--Left-->
          <UiText v-if="authStore.profile._id != message.user" size="sm" class="py-2 px-4 rounded-r-2xl rounded-bl-2xl max-w-[80%] bg-gray" :style="{ wordBreak: 'break-word' }">{{ message.content }}</UiText>

          <!--Right-->
          <UiText v-if="authStore.profile._id == message.user" size="sm" class="py-2 px-4 rounded-l-2xl rounded-tr-2xl max-w-[80%] bg-primary-800" :style="{ wordBreak: 'break-word' }">{{ message.content }}</UiText>
        </UiFlex>
      </div>
    </div>

    <!--Input-->
    <div class="w-full border-t border-gray-800 p-2 mt-auto">
      <UForm :state="state" @submit="send">
        <UiFlex class="gap-1">
          <UInput 
            v-model="state.text" 
            :disabled="!!loading.send"
            :loading="!!loading.send" 
            :ui="{ 
              padding: { md: 'pr-10' },
              color: { gray: { outline: 'ring-0 focus:ring-0 bg-gray' }} 
            }"
            color="gray"
            variant="outline"
            placeholder="Nhập nội dung..." 
            class="w-full" 
            size="md"
            id="InputChatUser"
            ref="input"
          />

          <UiIcon 
            name="i-basil-send-solid" 
            color="primary" 
            class="cursor-pointer absolute right-4" 
            size="6" 
            :disabled="!!loading.send" 
            @click="send"
          ></UiIcon>
        </UiFlex>
      </UForm>
    </div>
  </UiFlex>
</template>

<script setup>
const emits = defineEmits(['close'])

const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const conversation = ref(null)
const box = ref()
const input = ref()

const loading = ref({
  start: true,
  list: false,
  send: false,
})

const list = ref([])
const page = ref({
  _id: null,
  size: 20,
  skip: 0
})

const state = ref({
  conversation: null,
  text: null
})


const listFormat = computed(() => {
  if(!list.value.length) return []
  const messages = JSON.parse(JSON.stringify(list.value))

  const FIFTEEN_MINUTES = 15 * 60 * 1000

  messages.sort((a,b) => {
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

  const groupedMessages = []
  let currentGroup = [messages[0]]

  for (let i = 1; i < messages.length; i++) {
    const prevMsg = currentGroup[currentGroup.length - 1]
    const currMsg = messages[i]
    const timeDiff = new Date(currMsg.createdAt) - new Date(prevMsg.createdAt)

    if (timeDiff <= FIFTEEN_MINUTES) {
      currentGroup.push(currMsg)
    } else {
      groupedMessages.push(currentGroup)
      currentGroup = [currMsg]
    }
  }
  if (currentGroup.length) groupedMessages.push(currentGroup)

  const result = groupedMessages.map(group => {
    const startTime = new Date(group[0].createdAt).toISOString()
    const endTime = new Date(group[group.length - 1].createdAt).toISOString()
    return {
      start: startTime,
      end: endTime,
      messages: group.map(msg => {
        return {
          user: msg.user,
          content: msg.content || 'Không có nội dung',
        }
      })
    }
  })
  return result
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

const close = () => {
  emits('close')
  socketStore.changeChatData('single', { now: null })
}

const send = async () => {
  try {
    if(!!loading.value.send) return useNotify().error('Vui lòng đợi tin nhắn trước đang được gửi')
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(state.value.text.length > 100) return useNotify().error('Nội dung không vượt quá 100 ký tự')

    loading.value.send = true
    state.value.conversation = conversation.value._id
    $socket.emit('chat-single-send', JSON.parse(JSON.stringify(state.value)))

    state.value.text = null
    loading.value.send = false
    
    toBottom()
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

    page.value._id = conversation.value._id
    const data = await useAPI('socket/public/chat/single/message/list', JSON.parse(JSON.stringify(page.value)))

    list.value = list.value.concat(data.messages)
    conversation.value = data.conversation
    page.value.skip = list.value.length

    setTimeout(() => loading.value.list = false, 500) 
  }
  catch(e){
    socketStore.changeChatData('single', { now: null })
  }
}

const getStart = async () => {
  try {
    loading.value.start = true

    page.value._id = socketStore.chat.single.now
    const data = await useAPI('socket/public/chat/single/message/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.messages
    conversation.value = data.conversation
    page.value.skip = list.value.length

    loading.value.start = false
    toBottom()
    box.value.addEventListener('scroll', toScroll)

    // Read
    $socket.emit('chat-single-read', { conversation: conversation.value._id })
    $socket.emit('chat-single-new')
  }
  catch(e){
    socketStore.changeChatData('single', { now: null })
  }
}

watch(() => socketStore.chat.single.push.update, () => {
  if(!!loading.start) return

  const data = socketStore.chat.single.push.data
  if(data.conversation.toString() != conversation.value._id.toString()) return

  list.value.push(data)
  page.value.skip = list.value.length
  toBottom()

  // Read
  $socket.emit('chat-single-read', { conversation: conversation.value._id })
})

onMounted(() => {
  setTimeout(getStart, 1)
})
</script>