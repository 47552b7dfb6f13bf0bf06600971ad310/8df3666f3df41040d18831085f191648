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
          <UButton @click="modal = true" :loading="reseting" color="rose">Reset Web</UButton>
          <UButton @click="update('security')" :loading="updating">Cập Nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>

    <UModal prevent-close v-model="modal">
      <UiContent title="Reset Web" sub="Ngoài reset, bạn có muốn xóa thêm gì không" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>
        
        <UForm :state="stateReset" @submit="reset" >
          <UiFlex justify="between" class="mb-4">
            <UiText size="sm" weight="semibold" color="gray" text="Xóa tài khoản" />
            <UToggle v-model="stateReset.del_user" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText size="sm" weight="semibold" color="gray" text="Xóa cộng tác viên" />
            <UToggle v-model="stateReset.del_collab" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText size="sm" weight="semibold" color="gray" text="Xóa tin tức" />
            <UToggle v-model="stateReset.del_news" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText size="sm" weight="semibold" color="gray" text="Xóa diễn đàn" />
            <UToggle v-model="stateReset.del_forum" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText size="sm" weight="semibold" color="gray" text="Xóa giao dịch nạp" />
            <UToggle v-model="stateReset.del_payment" />
          </UiFlex>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" color="rose" :loading="reseting">Xác Nhận</UButton>
            <UButton color="gray" @click="modal = false" :disabled="reseting" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)
const reseting = ref(false)
const modal = ref(false)

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

const stateReset = ref({
  del_user: false,
  del_collab: false,
  del_forum: false,
  del_news: false,
  del_payment: false
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const reset = async () => {
  try {
    reseting.value = true

    await useAPI('config/manage/reset', JSON.parse(JSON.stringify(stateReset.value)))
    reseting.value = false
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