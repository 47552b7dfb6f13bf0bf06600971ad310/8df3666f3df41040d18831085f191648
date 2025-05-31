<template>
  <UiContent 
    title="Config Promo" 
    sub="Chỉnh sửa cấu hình khuyến mãi" 
    class="max-w-3xl mx-auto"
  >
    <UCard class="mb-4">
      <UForm :state="state">
        <UFormGroup label="Tặng Xu khi đăng ký tài khoản">
          <UInput v-model="state.promo.register.coin" />
        </UFormGroup>

        <UFormGroup label="Thưởng nạp lần đầu">
          <UInput v-model="state.promo.payment.first" />
        </UFormGroup>

        <UFormGroup label="Thưởng nạp lần 2">
          <UInput v-model="state.promo.payment.second" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton @click="update('promo')" :loading="updating">Cập Nhật</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,
  
  promo: {
    register: {
      coin: 0
    },
    payment: {
      first: 0,
      second: 0
    }
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
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