<template>
  <div>
    <UiMinibanner title="Tiếp Thị Liên Kết" sub="Chia sẻ nền tảng của chúng tôi để kiếm thêm thu nhập" type="affiliate" class="mb-4" />
    
  </div>
</template>

<script setup>
const configStore = useConfigStore()

useSeoMeta({
  title: () => `Tiếp Thị Liên Kết - ${configStore.config.name}`,
  ogTitle: () => `Tiếp Thị Liên Kết - ${configStore.config.name}`,
  description: () => `Chia sẻ nền tảng của chúng tôi để kiếm thêm thu nhập`,
  ogDescription: () => `Chia sẻ nền tảng của chúng tôi để kiếm thêm thu nhập`,
})
</script>