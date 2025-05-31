
<template>
  <div class="bg-card rounded-2xl">
    <DataEmpty v-if="!user || !!loading.load" :loading="loading.load" text="Không có thông tin" class="min-h-[300px]" />

    <div v-else class="rounded-2xl p-6">
      <UiFlex class="gap-2 mb-6 relative z-[3]">
        <DataUserAvatar size="lg" :user="user" no-action />
        <div class="grow">
          <DataUserName :user="user" size="sm" no-action class="mb-1.5"  />
          <DataUserLevel :user="user" />
        </div>
      </UiFlex>
      
      <UiFlex type="col" class="gap-4 relative z-[3]">
        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Chức vụ</UiText>
          <UiText weight="semibold" size="xs" :color="typeFormat[user.type]['color']">{{ typeFormat[user.type]['label'] }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Cảnh giới</UiText>
          <UiText weight="semibold" size="xs">{{ user.level ? user.level.title || '...' : '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Tài phú</UiText>
          <UiText weight="semibold" size="xs">{{ toMoney(user.currency.coin) }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">ECoin</UiText>
          <UiText weight="semibold" size="xs" color="primary">{{ toMoney(user.currency.ecoin) }}</UiText>
        </UiFlex>
      </UiFlex>
      
      <UiFlex justify="center" class="mt-4 gap-1" v-if="!!showChat">
        <SocketChatSingleCreate @done="emit('close')">
          <template #default="{ loading, create }">
            <UButton icon="i-bx-chat" block color="yellow" @click="create(user._id)" :loading="loading" :disabled="!!loading">Nhắn Tin</UButton>
          </template>
        </SocketChatSingleCreate>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const emit = defineEmits(['close', 'update:userData'])
const authStore = useAuthStore()

const props = defineProps({
  fetchId: String,
  reload: Number,
  userData: Object,
  noChat: Boolean
})

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'G-MOD', color: 'green' },
  2: { label: 'F-MOD', color: 'cyan' },
  100: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const loading = ref({
  load: true
})
const user = ref(undefined)
watch(() => props.reload, (val) => !!val && getProfile())

const showChat = computed(() => {
  if(!!props.noChat) return false
  if(!authStore.isLogin) return false
  if(!user.value) return false
  if(user.value._id.toString() == authStore.profile._id.toString()) return false
  return true
})

const getProfile = async () => {
  try {
    if(!props.fetchId) return false

    loading.value.load = true
    const get = await useAPI('user/public/profile', {
      _id: props.fetchId
    })

    user.value = get
    emit('update:userData', get)
    setTimeout(() => loading.value.load = false, 700)
  }
  catch(e) {
    loading.value.load = true
  }
}

onMounted(() => setTimeout(getProfile, 1))
</script>