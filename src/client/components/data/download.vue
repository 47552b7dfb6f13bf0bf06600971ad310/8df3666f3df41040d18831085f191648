<template>
  <UiFlex class="box-green rounded-2xl overflow-hidden gap-2 py-2 px-1">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/download.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Tải ứng dụng</UiText>
      <UiFlex class="gap-2">
        <UiIcon name="i-bxl-windows" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.windows)" />
        <UiIcon name="i-bxl-apple" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="modal.iphone = true" />
        <UiIcon name="i-bxl-android" class="cursor-pointer w-6 h-6 md:w-8 md:h-8" @click="download(configStore.config.download.android)"/>
      </UiFlex>
    </div>

    <UModal v-model="modal.iphone" preventClose :ui="{ width: 'sm:max-w-[370px]' }">
      <UiContent title="IPhone và IPad" sub="Hướng dẫn cài đặt ứng dụng" class="bg-card rounded-2xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal.iphone = false"></UButton>
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

const modal = ref({
  iphone: false
})

const download = (link) => {
  if(!link) return useNotify().error('Link tải chưa sẵn sàng, vui lòng quay lại sau')
  useTo().openNewTab(link)
}
</script>