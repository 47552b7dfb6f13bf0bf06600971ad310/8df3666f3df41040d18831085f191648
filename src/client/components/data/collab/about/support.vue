<template>
  <UiFlex>
    <slot :open="open"></slot>

    <UModal v-model="modal">
      <UiContent title="Liên Hệ Hỗ Trợ" sub="Bạn có thể liên hệ với chúng tôi qua các hình thức sau" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>

        <UiFlex class="mb-6" v-if="!!contact">
          <UiIcon name="i-bxs-map" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Địa chỉ</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.address || '...' }}</UiText>
        </UiFlex>
        <UiFlex class="mb-6">
          <UiIcon name="i-bxs-phone" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Điện thoại</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.phone || '...' }}</UiText>
        </UiFlex>
        <UiFlex>
          <UiIcon name="i-bxs-envelope" color="primary" class="mr-2" />
          <UiText size="sm" color="gray" weight="semibold" class="mr-auto" mini>Hòm thư</UiText>
          <UiText size="sm" weight="semibold" align="right" class="ml-6">{{ contact.email || '...' }}</UiText>
        </UiFlex>

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
const modal = ref(false)

const contact = ref(null)
const social = ref(null)

const open = async () => {
  const data = await useAPI('config/public/contact')
  contact.value = data.contact
  social.value = data.social
  delete social.value['game']
  modal.value = true
}

const toLink = (url) => {
  if(!url) return useNotify().error('Chúng tôi đang cập nhật thông tin, vui lòng quay lại sau')
  useTo().openNewTab(url)
}
</script>