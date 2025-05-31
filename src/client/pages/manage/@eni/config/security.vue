<template>
  <UiContent 
    title="Config Security" 
    sub="Chỉnh sửa cấu hình bảo mật" 
    class="max-w-3xl mx-auto"
  >
    <UCard class="mb-4">
      <UForm :state="state">
        <UFormGroup label="Mật khẩu ủy quyền">
          <UInput v-model="state.security.manage.password" />
        </UFormGroup>

        <UFormGroup label="Số tài khoản tối đa đăng ký trên 1 IP">
          <UInput v-model="state.security.register.ip" />
        </UFormGroup>

        <UFormGroup label="Số tài khoản tối đa đăng ký trên 1 thiết bị">
          <UInput v-model="state.security.register.device" />
        </UFormGroup>

        <UiFlex justify="between" class="mt-4">
          <UButton @click="reset" :loading="reseting" color="rose">Reset Web</UButton>
          <UButton @click="update('security')" :loading="updating">Cập Nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)
const reseting = ref(false)

const state = ref({
  change: null,
  
  security: {
    manage: {
      password: null
    },
    register: {
      ip: null,
      device: null
    }
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const reset = async () => {
  try {
    reseting.value = true

    await useAPI('config/manage/reset')
    reseting.value = false
    
    await authStore.removeAuth()
    $socket.emit('online-logout')
  }
  catch(e) {
    reseting.value = false
  }
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', JSON.parse(JSON.stringify(state.value)))
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>