<template>
  <UForm :validate="validate" :state="state" @submit="submit">
    <UFormGroup label="Tài khoản" name="username">
      <UInput icon="i-bxs-user" v-model="state.username" />
    </UFormGroup>

    <UFormGroup label="Mật khẩu" name="password">
      <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
    </UFormGroup>

    <UiFlex justify="between" class="mt-4">
      <div>
        <UiText pointer size="sm" color="gray" @click="emit('up')" class="mb-1">Đăng ký tài khoản ?</UiText>
        <UiText pointer size="sm" color="rose" @click="emit('forgot')">Quên mật khẩu ?</UiText>
      </div>
      <UButton type="submit" size="lg" color="yellow" :loading="loading">Đăng Nhập</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const emit = defineEmits(['done', 'up'])

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: 'Vui lòng nhập đầy đủ' })
  if (!state.password) errors.push({ path: 'password', message: 'Vui lòng nhập đầy đủ' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/sign/in', JSON.parse(JSON.stringify(state.value)))
    
    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>