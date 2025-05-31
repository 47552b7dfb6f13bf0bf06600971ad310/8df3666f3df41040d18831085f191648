<template>
  <UiContent 
    title="Config Price" 
    sub="Chỉnh sửa cấu hình giá trên hệ thống" 
    class="max-w-3xl mx-auto"
  >
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="bg-gray-1000 mb-2">
          <UiText class="text-white">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #vip>
        <UCard class="mb-4">
          <UForm :state="state">
            <UFormGroup label="Giá mua VIP tháng">
              <UInput v-model="state.vip.month" />
            </UFormGroup>

            <UFormGroup label="Giá mua VIP trọn đời">
              <UInput v-model="state.vip.forever" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('vip')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #guild>
        <UCard class="mb-4">
          <UForm :state="state">
            <UFormGroup label="Giá tạo Gia Tộc">
              <UInput v-model="state.guild.create" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('guild')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #yuan>
        <UCard>
          <UForm :state="state">
            <UFormGroup :label="`Tỷ lệ quy đổi tệ (1 tệ = ${state.yuan} Xu)`">
              <UInput v-model="state.yuan" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('yuan')" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,
  
  yuan: 0,

  vip: {
    month: 0,
    forever: 0
  },

  guild: {
    create: 0
  }
})

const menu = [
{
  label: 'Cấu hình VIP',
  slot: 'vip'
},
{
  label: 'Cấu hình Gia Tộc',
  slot: 'guild'
},
{
  label: 'Cấu hình Giá Tệ',
  slot: 'yuan'
}
]

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