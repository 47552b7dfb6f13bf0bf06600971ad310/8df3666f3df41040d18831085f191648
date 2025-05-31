<template>
  <UButton color="yellow" icon="i-bx-plus" @click="modal = true">Tạo</UButton>

  <UModal v-model="modal" prevent-close>
    <UiContent title="Tạo Gia Tộc Mới" sub="Nhập thông tin gia tộc mới" class="bg-card rounded-2xl p-4" no-dot>
      <template #more>
        <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" :disabled="!!loading" square @click="modal = false"></UButton>
      </template>

      <UForm :validate="validate" :state="state" @submit="submit">
        <UFormGroup label="Tên Gia Tộc" name="name">
          <UInput icon="i-bxs-castle" v-model="state.name" placeholder="Tên gia tộc từ 2-4 ký tự" />
        </UFormGroup>

        <UFormGroup label="Mô tả">
          <UTextarea v-model="state.description" autoresize />
        </UFormGroup>

        <UFormGroup label="Cấp độ được gia nhập lớn hơn hoặc bằng" name="request-level">
          <UInput icon="i-bxs-user" v-model="state.request.level" type="number" />
        </UFormGroup>

        <UFormGroup label="Xu thanh toán">
          <template #hint>
            <DataPaymentFast :custom="true">
              <template #default="{ toggle }">
                <DataUserCoin size="sm" @click="toggle()" />
              </template>
            </DataPaymentFast>
          </template>

          <UInput icon="i-bxs-coin" :model-value="`${useMoney().toMoney(configStore.config.guild.create)} Xu`" readonly />
        </UFormGroup>

        <UiFlex class="mt-4 gap-1">
          <UiFlex class="mr-auto">
            <UToggle v-model="state.request.auto" class="mr-2" />
            <UiText size="sm" weight="semibold" color="gray" text="Tự động xét duyệt" />
          </UiFlex>

          <UButton type="submit" size="md" color="yellow" :loading="loading">Tạo Ngay</UButton>
          <UButton :disabled="!!loading" @click="modal = false" color="gray" size="md">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UiContent>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()
const modal = ref(false)
const loading = ref(false)
const state = ref({
  name: null,
  description: '',
  request: {
    auto: false,
    level: 1
  }
})

const validate = (state) => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Vui lòng nhập đầy đủ' })
  else if (!!state.name.match(/\s/g)) errors.push({ path: 'name', message: 'Phát hiện khoảng cách' })
  else if (state.name.length < 2 || state.name.length > 4) errors.push({ path: 'name', message: 'Độ dài từ 2-4 ký tự' })
  if (state.request.level < 1 || state.request.level > 15) errors.push({ path: 'request-level', message: 'Vui lòng điền trong khoảng từ 1-15' })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('guild/public/action/create', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    modal.value = false
    await authStore.setAuth()
  }
  catch (e) {
    loading.value = false
  }
}
</script>