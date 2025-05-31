<template>
  <UiContent title="Cài Đặt" sub="Quản lý thông tin gia tộc" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading" @click="emit('close')"></UButton>
    </template>

    <UForm :validate="validate" :state="state" @submit="submit">
      <UFormGroup label="Mô tả" :hint="`${state.description ? state.description.length : 0}/100`" name="description">
        <UTextarea v-model="state.description" autoresize />
      </UFormGroup>

      <UFormGroup label="Cấp độ được gia nhập lớn hơn hoặc bằng" name="request-level">
        <UInput icon="i-bxs-user" v-model="state.request.level" type="number" />
      </UFormGroup>

      <UFormGroup label="Khác">
        <UiFlex type="col" class="gap-4 bg-gray rounded-2xl p-4">
          <UiFlex justify="between" class="w-full">
            <UiText size="sm" weight="semibold" color="gray" text="Nhận thành viên" />
            <UToggle v-model="state.request.active" class="mr-2" />
          </UiFlex>

          <UiFlex justify="between" class="w-full">
            <UiText size="sm" weight="semibold" color="gray" text="Tự động xét duyệt" />
            <UToggle v-model="state.request.auto" class="mr-2" />
          </UiFlex>
        </UiFlex>
      </UFormGroup>

      <UiFlex class="mt-4 gap-1" justify="end">
        <UButton type="submit" size="md" color="yellow" :loading="loading">Cập Nhật</UButton>
        <UButton :disabled="!!loading" @click="emit('close')" color="gray" size="md">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['guild'])
const emit = defineEmits(['close', 'update'])

const loading = ref(false)
const state = ref({
  description: props.guild.description || '',
  request: {
    active: props.guild.request.active,
    auto: props.guild.request.auto,
    level: props.guild.request.level
  }
})

const validate = (state) => {
  const errors = []
  if (state.description.length > 100) errors.push({ path: 'description', message: 'Giới thiệu không quá 100 ký tự' })
  if (state.request.level < 1 || state.request.level > 15) errors.push({ path: 'request-level', message: 'Vui lòng điền trong khoảng từ 1-15' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    const data = await useAPI('guild/public/action/config', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emit('update', data)
  }
  catch (e) {
    loading.value = false
  }
}
</script>