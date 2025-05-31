<template>
  <UForm :validate="validate" :state="state" @submit="submit">
    <UFormGroup label="Mật khẩu cũ" name="old">
      <UInput icon="i-bxs-lock" v-model="state.old" type="password"/>
    </UFormGroup>

    <UFormGroup label="Mật khẩu mới" name="new" :hint="`${state.new ? state.new.length : 0}/15`">
      <UInput icon="i-bxs-lock" v-model="state.new" type="password" />
    </UFormGroup>

    <UiFlex justify="end" class="mt-4">
      <UButton type="submit" :loading="loading" color="yellow">Xác Nhận</UButton>
      <UButton color="gray" @click="emit('close')" :disabled="loading" class="ml-1">Đóng</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const emit = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  old: undefined,
  new: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.old) errors.push({ path: 'old', message: 'Vui lòng nhập đầy đủ' })
  if (!state.new) errors.push({ path: 'new', message: 'Vui lòng nhập đầy đủ' })
  else if (state.new.length < 6 || state.new.length > 15) errors.push({ path: 'new', message: 'Độ dài 6-15 ký tự' })
  else if (!!state.new.match(/\s/g)) errors.push({ path: 'new', message: 'Phát hiện khoảng cách' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/edit/password', JSON.parse(JSON.stringify(state.value)))
    await setAuth()

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>