<template>
  <UiFlex>
    <UButton icon="i-bx-palette" color="gray" size="lg" square @click="open = true"/>

    <UModal v-model="open" :ui="{width: 'sm:max-w-[280px]'}">
      <UiContent title="Màu Sắc" sub="Chỉnh sửa màu giao diện" no-dot class="p-4">
        <!-- <SettingMode class="mb-2"/> -->
        <SettingColor />
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>