<template>
  <UiFlex>
    <UDropdown :items="actions">
      <UButton color="gray" icon="i-bx-dots-horizontal-rounded" />
    </UDropdown>

    <UModal v-model="modal.config" prevent-close>
      <DataGuildActionConfig :guild="guild" @close="modal.config = false" @update="updateConfig" />
    </UModal>

    <UModal v-model="modal.member" prevent-close :ui="{width: 'sm:max-w-[350px]'}">
      <DataGuildListMember :guild="guild" @close="modal.member = false" />
    </UModal>

    <UModal v-model="modal.request" prevent-close :ui="{width: 'sm:max-w-[350px]'}">
      <DataGuildListRequest :guild="guild" @close="modal.request = false" />
    </UModal>

    <UModal v-model="modal.del" prevent-close>
      <DataGuildActionDel :guild="guild" @close="modal.del = false" @done="doneDel"/>
    </UModal>

    <UModal v-model="modal.leave" prevent-close>
      <DataGuildActionLeave :guild="guild" @close="modal.leave = false" @done="doneLeave"/>
    </UModal>

    <UModal v-model="modal.donate" prevent-close>
      <DataGuildActionDonate :guild="guild" @close="modal.donate = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const props = defineProps(['guild'])
const emit = defineEmits(['update'])

const modal = ref({
  config: false,
  member: false,
  request: false,
  del: false,
  leave: false,
  donate: false
})

const updateConfig = (data) => {
  emit('update', data)
}

const doneDel = async () => {
  $socket.emit('chat-guild-leave-channel')
  modal.value.del = false
  await authStore.setAuth()
}

const doneLeave = async () => {
  $socket.emit('chat-guild-leave-channel')
  modal.value.leave = false
  await authStore.setAuth()
}

// Action Menu
const actions = computed(() => {
  if(!authStore.profile.guild) return []
  if(authStore.profile._id == props.guild.master) return [
    [{
      label: 'Cài đặt',
      icon: 'i-bx-cog',
      click: () => modal.value.config = true
    },{
      label: 'Yêu cầu gia nhập',
      icon: 'i-bx-user-plus',
      click: () => modal.value.request = true
    }],
    [{
      label: 'Cống hiến',
      icon: 'i-bx-donate-blood',
      click: () => modal.value.donate = true
    },{
      label: 'Thành viên',
      icon: 'i-bx-group',
      click: () => modal.value.member = true
    }],
    [{
      label: 'Giải tán',
      icon: 'i-bx-trash-alt',
      click: () => modal.value.del = true
    }]
  ]

  return [
    [{
      label: 'Cống hiến',
      icon: 'i-bx-donate-blood',
      click: () => modal.value.donate = true
    },{
      label: 'Thành viên',
      icon: 'i-bx-group',
      click: () => modal.value.member = true
    }],
    [{
      label: 'Rời gia tộc',
      icon: 'i-ion-exit-outline',
      click: () => modal.value.leave = true
    }]
  ]
})
</script>