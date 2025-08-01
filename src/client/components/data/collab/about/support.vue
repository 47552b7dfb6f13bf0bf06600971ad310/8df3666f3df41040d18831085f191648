<template>
  <UiFlex>
    <slot :open="open"></slot>

    <UModal v-model="modal">
      <UiContent title="Liên Hệ Hỗ Trợ" sub="Bạn có thể liên hệ với chúng tôi qua các hình thức sau" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>

        <div v-if="!!contact">
          <UiFlex class="mb-6">
            <UiIcon name="i-mdi-company" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Công ty</UiText>
            <UiText size="sm" weight="semibold" align="end" class="ml-6 max-w-[170px] md:max-w-[300px]">{{ contact.name || '...' }}</UiText>
          </UiFlex>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-map" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Địa chỉ</UiText>
            <UiText size="sm" weight="semibold" align="end" class="ml-6 max-w-[170px] md:max-w-[300px]">{{ contact.address || '...' }}</UiText>
          </UiFlex>
          <UiFlex class="mb-6">
            <UiIcon name="i-bxs-phone" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Điện thoại</UiText>
            <UiText size="sm" weight="semibold" align="end" class="ml-6 max-w-[170px] md:max-w-[300px]">{{ contact.phone || '...' }}</UiText>
          </UiFlex>
          <UiFlex>
            <UiIcon name="i-bxs-envelope" color="primary" class="mr-2" />
            <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Hòm thư</UiText>
            <UiText size="sm" weight="semibold" align="end" class="ml-6 max-w-[170px] md:max-w-[300px]">{{ contact.email || '...' }}</UiText>
          </UiFlex>
        </div>

        <UiFlex justify="center" class="gap-2 mt-6" wrap v-if="!!social">
          <UiImg 
            v-for="(value, key) in social" :key="key"
            class="max-w-[45px] max-h-[45px] cursor-pointer rounded-full"
            :src="`/images/social/${key}.png`"
            w="1" h="1"
            img-size="100px"
            :alt="key"
            @click="toLink(value)"
          ></UiImg>
        </UiFlex>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const social = computed(() => {
  const data = JSON.parse(JSON.stringify(configStore.config.social)) 
  delete data['game']
  return data
})

const contact = computed(() => {
  const data = JSON.parse(JSON.stringify(configStore.config.contact)) 
  return data
})

const open = async () => {
  modal.value = true
}

const toLink = (url) => {
  if(!url) return useNotify().error('Chúng tôi đang cập nhật thông tin, vui lòng quay lại sau')
  useTo().openNewTab(url)
}
</script>