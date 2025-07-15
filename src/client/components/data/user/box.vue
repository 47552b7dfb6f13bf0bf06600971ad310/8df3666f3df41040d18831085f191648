
<template>
  <div class="bg-card rounded-2xl">
    <DataEmpty v-if="!user || !!loading.load" :loading="loading.load" text="Không có thông tin" class="min-h-[300px]" />

    <div v-else class="rounded-2xl p-6">
      <UiFlex class="gap-2 mb-4 relative">
        <DataUserAvatar size="lg" :user="user" no-action />
        
        <div class="grow">
          <UiFlex class="gap-1 mb-1.5">
            <DataUserName :user="user" size="sm" no-action class="mr-auto" />

            <UDropdown :items="actions" v-if="!!authStore.isLogin && authStore.profile._id == user._id">
              <UButton icon="i-bx-cog" size="2xs" color="gray" square></UButton>
            </UDropdown>

            <UButton icon="i-bx-x" size="2xs" color="gray" square @click="emit('close')"></UButton>
          </UiFlex>
    
          <DataUserLevel :user="user" />
        </div>
      </UiFlex>

      <DataUserCharacter 
        :character="character" 
        :powers="powers"
        :user="fetchId"
        @use="changeUseCharacter"
        @sex="getCharacter"
        @upgrade="changeUseEquipLevel"
        v-if="!loading.character && ((!!authStore.isLogin && authStore.profile._id == user._id) || (!!character && character.sex > 0))"
      />

      <UiFlex justify="center" class="bg-gray rounded-2xl p-4 mb-4" v-if="!!user.description">
        <UiText align="center" color="gray" size="sm" weight="semibold" class="italic">{{ user.description }}</UiText>
      </UiFlex>
      
      <UiFlex type="col" class="gap-4 relative">
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
          <UiText weight="semibold" color="gray" size="xs">Tài phú (Khóa)</UiText>
          <UiText weight="semibold" size="xs">{{ toMoney(user.currency.lcoin) }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">ECoin</UiText>
          <UiText weight="semibold" size="xs" color="primary">{{ toMoney(user.currency.ecoin) }}</UiText>
        </UiFlex>

        <UiFlex justify="between" items="start" class="w-full gap-2" v-if="!!social">
          <UiText weight="semibold" color="gray" size="xs">Mạng xã hội</UiText>

          <UiFlex justify="center" class="gap-1" wrap>
            <UiImg 
              v-for="item in social" :key="item.key"
              class="max-w-[30px] max-h-[30px] cursor-pointer rounded-full"
              :src="`/images/social/${item.key}.png`"
              w="1" h="1"
              img-size="100px"
              :alt="key"
              @click="useTo().openNewTab(item.value)"
            ></UiImg>
          </UiFlex>
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

    <UModal v-model="modal.profile" preventClose>
      <UiContent title="Chỉnh Sửa" sub="Cập nhật thông tin cá nhân" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.profile = false"></UButton>
        </template>

        <AuthEditProfile @done="modal.profile = false, getProfile()" @close="modal.profile = false" />
      </UiContent>
    </UModal>

    <UModal v-model="modal.password" preventClose>
      <UiContent title="Bảo Mật" sub="Thay đổi mật khẩu" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.password = false"></UButton>
        </template>
        
        <AuthEditPassword @done="modal.password = false" @close="modal.password = false" />
      </UiContent>
    </UModal>
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
  3: { label: 'S-MOD', color: 'purple' },
  100: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const loading = ref({
  load: true,
  character: true
})

const modal = ref({
  password: false,
  profile: false
})

const user = ref(undefined)
const character = ref(undefined)
const powers = ref(undefined)

const actions = [
  [{
    label: 'Sửa thông tin',
    icon: 'i-bxs-id-card',
    click: () => modal.value.profile = true
  },
{
    label: 'Đổi mật khẩu',
    icon: 'i-bxs-lock',
    click: () => modal.value.password = true
  }]
]

const social = computed(() => {
  if(!user.value) return null
  if(!user.value.social) return null
  const list = []
  for (const [key, value] of Object.entries(user.value.social)) {
    if(!!value && value != '') list.push({ key, value })
  }
  return list.length > 0 ? list : null
})

const showChat = computed(() => {
  if(!!props.noChat) return false
  if(!authStore.isLogin) return false
  if(!user.value) return false
  if(user.value._id.toString() == authStore.profile._id.toString()) return false
  return true
})

const changeUseCharacter = (data) => {
  if(!character.value) return
  if(!character.value[data.type]) return

  character.value[data.type].use = data.equip
}

const changeUseEquipLevel = (data) => {
  if(!character.value) return
  if(!character.value[data.type]) return

  character.value[data.type].level = data.level
}

const getCharacter = async () => {
  try {
    loading.value.character = true
    const data = await useAPI('user/public/character/get', { _id: props.fetchId })
    character.value = data.character
    powers.value = data.powers

    loading.value.character = false
  }
  catch(e){
    loading.value.character = false
  }
}

const getProfile = async () => {
  try {
    if(!props.fetchId) return false

    loading.value.load = true
    const get = await useAPI('user/public/profile', { _id: props.fetchId })

    user.value = get
    emit('update:userData', get)
    getCharacter()
    setTimeout(() => loading.value.load = false, 700)
  }
  catch(e) {
    loading.value.load = true
  }
}

watch(() => props.reload, (val) => !!val && getProfile())
onMounted(() => setTimeout(getProfile, 1))
</script>