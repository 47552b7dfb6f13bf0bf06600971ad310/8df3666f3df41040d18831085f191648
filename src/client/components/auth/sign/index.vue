<template>
  <UiFlex class="gap-1">
    <UButton @click="tabItem = 0, modal = true" color="gray" class="px-4" size="lg">Đăng Nhập</UButton>
    <UButton @click="tabItem = 1, modal = true" color="yellow" class="px-4" size="lg">Đăng Ký</UButton>

    <UModal v-model="modal">
      <UCard class="bg-card">
        <UiFlex class="mb-6 gap-2">
          <UiText weight="bold" class="text-md md:text-xl">
            Chào mừng đến với cổng trò chơi <br>trực tuyến <span class="text-primary">{{ configStore.config.name }}</span>
          </UiText>

          <UButton icon="i-bx-x" class="ml-auto" size="xs" color="white" square @click="modal = false"></UButton>
        </UiFlex>

        <LazyAuthSignIn v-if="tabItem == 0" @up="tabItem = 1" @done="doneIn"></LazyAuthSignIn>
        <LazyAuthSignUp v-if="tabItem == 1" @in="tabItem = 0" @done="doneUp"></LazyAuthSignUp>   
      </UCard>
    </UModal>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()

const modal = ref(false)
const tabItem = ref(0) 

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(modal, (val) => !val && authStore.setModal(false))

const doneIn = async () => {
  modal.value = false
  await nextTick()
  await authStore.setAuth()
}

const doneUp = async () => {
  authStore.setWelcome(true)
  await nextTick()
  await authStore.setAuth()
}
</script>