<template>
  <UiFlex>
    <UButton size="2xs" class="color-blue-light bg-anim-light" icon="i-bx-credit-card" @click="open = true" v-if="!custom">Nạp Thêm</UButton>
    <slot :toggle="toggle"></slot>

    <UModal v-model="open" preventClose :ui="{ width: 'sm:max-w-2xl' }">
      <UiContent title="Nạp Xu" sub="Hệ thống nạp xu vào tài khoản" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="open = false"></UButton>
        </template>

        <DataPaymentCreate :fast="true"/>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['custom'])
const open = ref(false)
const toggle = () => open.value = !open.value
</script>