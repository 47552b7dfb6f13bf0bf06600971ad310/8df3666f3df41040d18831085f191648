<template>
  <UiContent no-dot title="Hệ Điều Hành" sub="Chọn hệ điều hành muốn chơi" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="loading.play" @click="emits('close')"></UButton>
    </template>

    <UAlert 
      v-if="os != 'china' && !game.open && (!authStore.isAdmin && !authStore.isGMod)"
      color="rose" 
      variant="soft" 
      icon="i-bx-bell" 
      title="Thông Báo"
      description="Trò chơi chưa khai mở, vui lòng quay lại sau"
    >
      <template #icon="{ icon }">
        <UiIcon :name="icon" size="10"/>
      </template>
    </UAlert>

    <div v-else>
      <UAlert 
        v-if="!game.play.web && !game.play.android && !game.play.ios && !game.play.windows"
        color="rose" 
        variant="soft" 
        icon="i-bx-bell" 
        title="Thông Báo"
        description="Trò chơi đang bảo trì, vui lòng quay lại sau"
      >
        <template #icon="{ icon }">
          <UiIcon :name="icon" size="10"/>
        </template>
      </UAlert>

      <UiFlex class="gap-1" justify="center" wrap v-else>
        <UButton v-if="game.play.web" icon="i-bxs-window-alt" :disabled="loading" color="white" size="xl" @click="emits('play', 'web')">Web</UButton>
        <UButton v-if="game.play.android" icon="i-bxl-android" :disabled="loading" color="green" size="xl" @click="emits('play', 'android')">Android</UButton>
        <UButton v-if="game.play.ios" icon="i-bxl-apple" :disabled="loading" color="black" size="xl" @click="emits('play', 'ios')">Iphone</UButton>
        <UButton v-if="game.play.windows" icon="i-bxl-windows" :disabled="loading" color="blue" size="xl" @click="emits('play', 'windows')">Windows</UButton>
      </UiFlex>
    </div>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game', 'loading', 'os'])
const emits = defineEmits(['play', 'close'])
</script>