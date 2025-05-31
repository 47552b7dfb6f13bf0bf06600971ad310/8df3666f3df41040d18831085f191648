<template>
  <div>
    <UiMinibanner title="Mời Bạn" sub="Giới thiệu bạn bè tham gia và kiếm thêm thu nhập" type="invite" class="mb-4" />

    <UiFlex>
      <UTabs :default-index="tabFormat[route.path]" :items="items" @change="onChange" class="w-full md:w-auto"/>
    </UiFlex>

    <NuxtPage />
  </div>
</template>

<script setup>
const route = useRoute()

const tabFormat = {
  '/money/invite': 0,
  '/money/invite/manage': 1
}
const items = [
  { label: 'Giới Thiệu', to: '/money/invite', icon: 'i-mdi-about' },
  { label: 'Quản Lý', to: '/money/invite/manage', icon: 'i-bxs-group' }
]

const onChange = (index) => {
  navigateTo(items[index].to)
}
</script>