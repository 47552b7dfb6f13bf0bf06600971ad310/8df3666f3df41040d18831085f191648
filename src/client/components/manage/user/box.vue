
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
          <UiText weight="semibold" color="gray" size="xs">Email</UiText>
          <UiText weight="semibold" size="xs">{{ user.email || '...' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiText weight="semibold" color="gray" size="xs">Số diện thoại</UiText>
          <UiText weight="semibold" size="xs">{{ user.phone || '...' }}</UiText>
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

        <UiFlex justify="between" class="w-full" v-if="!!user.inviter">
          <UiText weight="semibold" color="gray" size="xs">Người giới thiệu</UiText>
          <ManageUser :user="user.inviter" />
        </UiFlex>
      </UiFlex>
      
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const { toMoney } = useMoney()
const emit = defineEmits(['close', 'update:userData'])

const props = defineProps({
  fetchId: String,
  reload: Number,
  userData: Object,
  noChat: Boolean,
  collab: String
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
  load: true
})
const user = ref(undefined)
watch(() => props.reload, (val) => !!val && getProfile())

const getProfile = async () => {
  try {
    if(!props.fetchId) return false
    loading.value.load = true

    const get = await useAPI('user/public/profile', {
      _id: props.fetchId,
      collab: props.collab
    })

    user.value = get
    emit('update:userData', get)
    setTimeout(() => loading.value.load = false, 500)
  }
  catch(e) {
    loading.value.load = true
  }
}

onMounted(() => setTimeout(getProfile, 1))
</script>