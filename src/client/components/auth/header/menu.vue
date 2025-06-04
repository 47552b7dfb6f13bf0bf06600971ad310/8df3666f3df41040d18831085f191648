<template>
  <UiFlex>
    <UPopover :ui="{wrapper: 'inline-flex'}" :popper="{ strategy: 'absolute', placement: 'bottom-end' }" v-model:open="open">
      <UButton
        class="relative"
        icon="i-bx-user"
        color="yellow" square size="lg"
      ></UButton>

      <template #panel>
        <div class="w-[220px] max-w-sreen p-2">
          <UiFlex
            v-for="(item, index) in menuUser" :key="index"
            class="MenuItem gap-2 text-gray-500 rounded-2xl"
            @click="item.click()"
          >
            <UiIcon class="MenuItem__Icon" :name="item.icon" size="6" />
            <UiText class="MenuItem__Text" size="sm" weight="semibold" color="gray">{{ item.label }}</UiText>
          </UiFlex>
        </div>
      </template>
    </UPopover>

    <UModal v-model="modal.view" :ui="{width: 'sm:max-w-[400px]'}">
      <DataUserBox :fetch-id="authStore.profile._id" :no-chat="true" />
    </UModal>

    <UModal v-model="modal.history.payment" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Nạp" sub="Danh sách các giao dịch nạp Xu" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.payment = false"></UButton>
        </template>

        <DataPaymentHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.game" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Lịch Sử Chơi" sub="Các trò chơi đã chơi hoặc thanh toán" no-dot class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.game = false"></UButton>
        </template>

        <DataGamePlayed />
      </UiContent>
    </UModal>

    <UModal v-model="modal.game.manager" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageGameGM class="p-4" @to="modal.game.manager = false" @close="modal.game.manager = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const { $socket } = useNuxtApp()
const configStore = useConfigStore()
const authStore = useAuthStore()

const open = ref(false)

const modal = ref({
  view: false,
  history: {
    game: false,
    payment: false
  },
  game: {
    manager: false
  }
})

const logout = async () => {
  await authStore.removeAuth()
  $socket.emit('online-logout')
}

const menuUser = computed(() => {
  const list = []

  if(!!authStore.isAdmin || !!authStore.isSMod){
    list.push({
      label: 'Quản trị viên',
      icon: 'i-bx-shield-quarter',
      click: () => navigateTo('/manage')
    })
  }

  if(!!authStore.isAdmin || !!authStore.isSMod || !!authStore.isGMod){
    list.push({
      label: 'Quản lý trò chơi',
      icon: 'i-hugeicons-ai-game',
      click: () => { open.value = false, modal.value.game.manager = true }
    })
  }

  if(!!configStore.collab.active){
    if(!!authStore.isAdmin || (configStore.collab.user == authStore.profile._id)){
      list.push({
        label: 'Cộng tác viên',
        icon: 'i-carbon-collaborate',
        click: () => useTo().openNewTab(`/manage/@collab/${configStore.collab.code}`)
      })
    }
  }

  return [
    ...list,
    {
      label: 'Thông tin',
      icon: 'i-bx-user',
      click: () => { open.value = false, modal.value.view = true }
    },{
      label: 'Lịch sử nạp',
      icon: 'i-bx-credit-card',
      click: () => { open.value = false, modal.value.history.payment = true }
    },{
      label: 'Lịch sử chơi',
      icon: 'i-bx-history',
      click: () => { open.value = false, modal.value.history.game = true }
    },{
      label: 'Đăng xuất',
      icon: 'i-bx-log-out',
      click: () => logout()
    }
  ]
})
</script>