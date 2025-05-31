<template>
  <UiFlex class="box-green rounded-2xl overflow-hidden gap-2 py-2 px-1">
    <UiImg src="/images/icon/download.png" class="h-[90%] w-[20%] md:w-[30%] ml-2" />
    <div>
      <UiText class="text-xs md:text-base mb-1">Tải ứng dụng</UiText>
      <UiFlex class="gap-2">
        <UiIcon name="i-bxl-windows" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.windows)" />
        <UiIcon name="i-bxl-apple" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.ios)" />
        <UiIcon name="i-bxl-android" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.android)"/>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const download = (link) => {
  if(!link) return useNotify().error('Link tải chưa sẵn sàng, vui lòng quay lại sau')
  useTo().openNewTab(link)
}
</script>