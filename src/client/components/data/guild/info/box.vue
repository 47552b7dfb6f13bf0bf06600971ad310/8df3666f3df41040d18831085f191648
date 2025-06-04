
<template>
  <div class="bg-card rounded-2xl">
    <DataEmpty v-if="!guild || !!loading.data" :loading="loading.data" text="Không có thông tin" class="min-h-[300px]" />

    <div v-else class="p-2">
      <DataGuildInfoMini :guild="guild" :no-view="true" :no-member="true">
        <DataGuildInfoLevel :guild="guild" class="w-full" />
      </DataGuildInfoMini>

      <UiFlex justify="center" class="bg-gray rounded-2xl p-4 mx-2 mt-3 mb-4" v-if="!!guild.description">
        <UiText align="center" size="sm" weight="semibold" class="italic" color="gray">{{ guild.description }}</UiText>
      </UiFlex>
      
      <UiFlex type="col" class="gap-5 relative px-2 my-3">
        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Bang chủ</UiText>
          <DataUserName :user="guild.master" no-guild />
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Thành viên</UiText>
          <UiText weight="semibold" size="xs">{{ guild.member }} / {{ guild.level.limit.member }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Thưởng nạp</UiText>
          <UiText weight="semibold" size="xs" color="primary">{{ guild.level.bonus.payment }}%</UiText>
        </UiFlex>
      </UiFlex>

      <div class="px-4 py-2" v-if="!!actionJoinShow">
        <UButton 
          v-if="guild.statusJoin == 1"
          icon="i-bxs-chevrons-right" 
          block color="yellow" 
          @click="join" 
          :loading="loading.join" 
          :disabled="!!loading.join"
        >
          Gia Nhập
        </UButton>

        <UButton 
          v-if="guild.statusJoin == 2"
          icon="i-bx-redo" 
          block color="gray" 
          @click="undo" 
          :loading="loading.undo" 
          :disabled="!!loading.undo"
        >
          Hủy Yêu Cầu
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const emit = defineEmits(['close'])

const props = defineProps({
  fetchId: String,
  noChat: Boolean
})

const loading = ref({
  data: true,
  join: false,
  undo: false
})
const guild = ref(undefined)

const actionJoinShow = computed(() => {
  if(!guild.value) return false
  if(!authStore.isLogin) return false
  if(!!authStore.profile.guild) return false
  if(guild.value.statusJoin < 1 || guild.value.statusJoin > 2) return false
  return true
})

const join = async () => {
  try {
    loading.value.join = true
    const data = await useAPI('guild/public/request/join', { _id: guild.value._id })
    
    loading.value.join = false
    getGuild()
    if(data == 1) await authStore.setAuth()
  }
  catch(e) {
    loading.value.join = false
  }
}

const undo = async () => {
  try {
    loading.value.undo = true
    await useAPI('guild/public/request/undo', { _id: guild.value._id })

    loading.value.undo = false
    getGuild()
  }
  catch(e) {
    loading.value.undo = false
  }
}

const getGuild = async () => {
  try {
    if(!props.fetchId) return false

    loading.value.data = true
    const get = await useAPI('guild/public/profile', { _id: props.fetchId})

    guild.value = get
    setTimeout(() => loading.value.data = false, 500)
  }
  catch(e) {
    loading.value.data = true
  }
}

onMounted(() => setTimeout(getGuild, 1))
</script>