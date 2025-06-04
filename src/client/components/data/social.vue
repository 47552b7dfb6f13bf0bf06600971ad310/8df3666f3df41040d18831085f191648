<template>
  <UiFlex class="box-blue rounded-2xl overflow-hidden gap-2 py-2 px-1">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/support.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Mạng xã hội</UiText>
      <UiFlex class="gap-2">
        <UiIcon name="i-bxl-facebook" class="w-6 h-6 md:w-8 md:h-8 cursor-pointer" @click="open(configStore.config.social.facebook)" />
        <UiIcon name="i-bxl-messenger" class="w-6 h-6 md:w-8 md:h-8 cursor-pointer" @click="open(configStore.config.social.messenger)" />
        <UiIcon name="i-bxl-telegram" class="w-6 h-6 md:w-8 md:h-8 cursor-pointer" @click="open(configStore.config.social.telegram)"/>
        <UiIcon name="i-bxl-tiktok" class="w-6 h-6 md:w-8 md:h-8 cursor-pointer" @click="open(configStore.config.social.tiktok)"/>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const open = (link) => {
  if(!link) return useNotify().error('Kênh hỗ trợ chưa sẵn sàng, vui lòng quay lại sau')
  useTo().openNewTab(link)
}
</script>