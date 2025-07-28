<template>
  <div>
    <UAlert title="Quên Mật Khẩu" color="rose" variant="soft" class="mb-4" description="Sử dụng Email đã đăng ký để đặt lại mật khẩu"></UAlert>

    <UForm
      ref="form"
      :validate="validate"
      :state="state"
      @submit="submit"
    >
      <UFormGroup label="Tài khoản" name="username" required>
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Email đăng ký" name="email" required>
        <UInput icon="i-bxs-envelope" v-model="state.email" />

        <template #hint>
          <UButton size="xs" variant="link" color="primary" :loading="otp.sending" @click="getOTP">
            Lấy mã xác thực
          </UButton>
        </template>
      </UFormGroup>

      <UFormGroup label="Mã xác thực" name="otp" required>
        <UInput icon="i-bxs-barcode" v-model="state.otp" />
      </UFormGroup>

      <UFormGroup label="Mật khẩu mới" name="password" required :hint="`${state.password ? state.password.length : 0}/15`">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UiFlex justify="between" class="mt-4">
        <UiText pointer size="sm" color="gray" @click="emit('in')">Quay lại đăng nhập ?</UiText>
        <UButton type="submit" size="lg" color="yellow" :loading="loading">Xác Nhận</UButton>
      </UiFlex>
    </UForm>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const emit = defineEmits(['done', 'in'])

const form = ref()
const loading = ref(false)
const otp = ref({
  sending: false
})

const state = ref({
  username: undefined,
  email: undefined,
  otp: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  
  if (!state.email) errors.push({ path: 'email', message: 'Vui lòng nhập đầy đủ' })
  else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: 'Định dạng không đúng' })

  if (!state.otp) errors.push({ path: 'otp', message: 'Vui lòng nhập đầy đủ' })

  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: 'Phát hiện khoảng cách' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true

    await useAPI('auth/public/sign/forgot', JSON.parse(JSON.stringify(state.value)))
    
    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}

const getOTP = async () => {
  try {
    if(!state.value.email) return form.value.setErrors([{ path: 'email', message: 'Vui lòng nhập Email trước' }])

    otp.value.sending = true
    await useAPI('auth/public/sign/OTP', JSON.parse(JSON.stringify(state.value)))
    
    otp.value.sending = false
  }
  catch (e) {
    otp.value.sending = false
  }
}
</script>