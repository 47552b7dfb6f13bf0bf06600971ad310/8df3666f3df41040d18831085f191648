<template>
  <UiFlex type="col" class="grow w-full overflow-hidden">
    <!--User Info-->
    <UiFlex class="w-full gap-2 border-b border-gray-800" v-if="guild">
      <DataGuildInfoMini :guild="guild" :no-member="true">
        <UiText size="xs" color="gray">Kênh Riêng Tư</UiText>
      </DataGuildInfoMini>

      <DataGuildAction :guild="guild" @update="updateConfig" class="ml-auto mr-2" />
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
      <UiFlex v-for="chat in listFormat" :key="chat._id" class="w-full my-4">
        <UiFlex class="w-full space-x-2" items="start">
          <DataUserAvatar :user="chat.user" size="md"/>
          
          <div class="text-left">
            <DataUserName no-guild :user="chat.user" class="mb-1.5" size="xs"/>

            <div class="inline-block bg-gray p-2 px-3 rounded-r-2xl rounded-bl-2xl text-left mb-2" :style="{ wordBreak: 'break-word' }">
              <UiText size="sm" v-html="chat.content || 'Không có nội dung'"></UiText>
            </div>

            <UiFlex>
              <UiText color="gray"  class="leading-none mx-2 text-[0.7rem]" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
              <UiText color="primary" class="leading-none mx-2 text-[0.7rem] cursor-pointer" mini @click="reply(chat.user)">Trả lời</UiText>
              <UiText color="rose" class="leading-none mx-2 text-[0.7rem] cursor-pointer" mini @click="del(chat._id)" v-if="guild.master == authStore.profile._id">Xóa</UiText>
            </UiFlex>
          </div>
        </UiFlex>
      </UiFlex>
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
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const guild = ref(null)
const box = ref()
const input = ref()

const loading = ref({
  start: true,
  list: false,
  send: false,
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

const updateConfig = (data) => {
  guild.value = data
}

const reply = (user) => {
  state.value.text = `@${user.username} `
  toFocus()
}

const del = async (_id) => {
  await useAPI('socket/public/chat/guild/del', { _id: _id })
}

const send = async () => {
  try {
    if(!!loading.value.send) return useNotify().error('Vui lòng đợi tin nhắn trước đang được gửi')
    if(!state.value.text) return useNotify().error('Vui lòng nhập nội dung')
    if(state.value.text.length > 100) return useNotify().error('Nội dung không vượt quá 100 ký tự')

    loading.value.send = true
    await useAPI('socket/public/chat/guild/send', JSON.parse(JSON.stringify(state.value)))

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
    const data = await useAPI('socket/public/chat/guild/list', JSON.parse(JSON.stringify(page.value)))

    list.value = list.value.concat(data.messages)
    guild.value = data.guild
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
    const data = await useAPI('socket/public/chat/guild/list', JSON.parse(JSON.stringify(page.value)))
    list.value = data.messages
    guild.value = data.guild
    page.value.skip = list.value.length
    
    loading.value.start = false 
    toBottom()
    box.value.addEventListener('scroll', toScroll)
  }
  catch {
    loading.value.start = false
  }
}

watch(() => socketStore.chat.guild.push.update, () => {
  const data = socketStore.chat.guild.push.data

  list.value.push(data)
  page.value.skip = list.value.length
  toBottom()
})

watch(() => socketStore.chat.guild.del.update, () => {
  const data = socketStore.chat.guild.del.data
  if(list.value.length == 0) return

  const index = list.value.findLastIndex(i => i._id == data)
  if(index < 0) return

  list.value.splice(index, 1)
  page.value.skip = list.value.length
})

onMounted(() => {
  setTimeout(getStart, 1)

  socketStore.changeChatData('guild', { new: 0 })
  $socket.emit('chat-guild-join-channel')
})
</script>