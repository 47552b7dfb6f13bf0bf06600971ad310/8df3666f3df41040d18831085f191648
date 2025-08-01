<template>
  <UiFlex class="box-green rounded-2xl overflow-hidden gap-2 py-2 px-1">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/download.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Tải ứng dụng</UiText>
      <UiFlex class="gap-2">
        <UiIcon name="i-bxl-windows" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.windows, 'windows')" />
        <UiIcon name="i-bxl-apple" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.ios, 'ios')" />
        <UiIcon name="i-bxl-android" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.android, 'android')"/>
      </UiFlex>
    </div>

    <UModal v-model="modal.ios" preventClose :ui="{ width: 'sm:max-w-[370px]' }">
      <UiContent title="IPhone và IPad" sub="Hướng dẫn cài đặt ứng dụng" class="bg-card rounded-2xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal.ios = false"></UButton>
        </template>

        <UiFlex class="flex gap-1 mb-2" wrap>
          1. Nhấn nút 
          <UiIcon name="i-ion-share-outline" color="yellow" size="5" />
          <strong class="text-yellow-500">Chia sẻ</strong> 
        </UiFlex>

        <UiFlex class="flex gap-1" wrap>
          2. Chọn 
          <UiIcon name="i-icon-park-outline-add" color="yellow" size="5" />
          <strong class="text-yellow-500">Thêm vào Màn hình chính</strong> 
        </UiFlex>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const { isAndroid, isDesktop } = useDevice()

const modal = ref({
  ios: false
})

const download = async (link, type) => {
  // Had Link
  if(!!link) {
    const link = document.createElement('a')
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return
  }

  // IOS
  if(type == 'ios') return modal.value.ios = true

  // Android and Windows
  if(type == 'android'){
    if(!!configStore.installPrompt && !!isAndroid){
      await configStore.installPrompt.prompt()
      return configStore.setInstallPrompt(null)
    }
    else return useNotify().error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  }

  // Windows
  if(type == 'windows'){
    if(!!configStore.installPrompt && !!isDesktop){
      await configStore.installPrompt.prompt()
      return configStore.setInstallPrompt(null)
    }
    else return useNotify().error('Chúng tôi đang cập nhật link tải, vui lòng quay lại sau')
  }
}
</script>