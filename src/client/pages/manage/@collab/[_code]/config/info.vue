<template>
  <UiContent 
    title="Config Info" 
    sub="Chỉnh sửa thông tin trang cộng tác viên" 
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

      <template #basic>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên trang">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.short_name" />
            </UFormGroup>

            <UFormGroup label="Mô tả">
              <UTextarea autoresize v-model="state.description" name="input" />
            </UFormGroup>

            <UFormGroup label="Logo">
              <UiUploadImage v-model="state.logo_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup label="Banner">
              <UiUploadImage v-model="state.og_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.og_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #contact>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Tên tổ chức">
              <UInput v-model="state.contact.name" />
            </UFormGroup>

            <UFormGroup label="Tên viết tắt">
              <UInput v-model="state.contact.prefix" />
            </UFormGroup>

            <UFormGroup label="Số điện thoại">
              <UInput v-model="state.contact.phone" />
            </UFormGroup>

            <UFormGroup label="Hòm thư">
              <UInput v-model="state.contact.email"/>
            </UFormGroup>

            <UFormGroup label="Địa chỉ">
              <UInput v-model="state.contact.address" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #social>
        <UCard class="mb-4">
          <UForm :state="state">
            <UFormGroup label="Facebook">
              <UInput v-model="state.social.facebook" />
            </UFormGroup>

            <UFormGroup label="Messenger">
              <UInput v-model="state.social.messenger" />
            </UFormGroup>

            <UFormGroup label="Zalo">
              <UInput v-model="state.social.zalo" />
            </UFormGroup>

            <UFormGroup label="Telegram">
              <UInput v-model="state.social.telegram" />
            </UFormGroup>

            <UFormGroup label="Tiktok">
              <UInput v-model="state.social.tiktok" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>

        <UCard>
          <UForm :state="state">
            <UFormGroup label="Zalo Game Private">
              <UInput v-model="state.social.game.private" />
            </UFormGroup>

            <UFormGroup label="Zalo Game Tool">
              <UInput v-model="state.social.game.tool" />
            </UFormGroup>

            <UFormGroup label="Zalo Game China">
              <UInput v-model="state.social.game.china" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update" :loading="updating">Cập nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #download>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Windows">
              <UInput v-model="state.download.windows" />
            </UFormGroup>

            <UFormGroup label="Mac">
              <UInput v-model="state.download.mac" />
            </UFormGroup>

            <UFormGroup label="Android">
              <UInput v-model="state.download.android" />
            </UFormGroup>

            <UFormGroup label="IOS">
              <UInput v-model="state.download.ios" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton @click="update('download')" :loading="updating">Cập Nhật</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const route = useRoute()

const load = ref(true)
const updating = ref(false)

const state = ref({
  code: route.params._code,

  name: '',
  short_name: '',
  description: '',
  og_image: '',
  logo_image: '',

  download: {
    windows: '',
    mac: '',
    android: '',
    ios: ''
  },

  contact: {
    name: '',
    phone: '',
    email: '',
    address: '',
    prefix: '',
  },

  social: {
    facebook: '',
    messenger: '',
    zalo: '',
    telegram: '',
    tiktok: '',
    game: {
      china: '',
      private: '',
      tool: '',
    }
  }
})

const menu = [
{
  label: 'Cơ bản',
  slot: 'basic'
},
{
  label: 'Liên hệ',
  slot: 'contact'
},
{
  label: 'Mạng xã hội',
  slot: 'social'
},
{
  label: 'Ứng dụng',
  slot: 'download'
}
]

const getConfig = async () => {
  const config = await useAPI('collab/manage/code/config/info/get', { code: route.params._code })
  state.value = Object.assign(state.value, config)
  console.log(state.value)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true
    await useAPI('collab/manage/code/config/info/update', JSON.parse(JSON.stringify(state.value)))
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>