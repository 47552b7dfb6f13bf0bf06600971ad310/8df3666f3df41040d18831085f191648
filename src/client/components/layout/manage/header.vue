<template>
  <header class="
    sticky safe-area-top top-0 z-50 
    bg-gray-1000
    border-b border-gray-200 dark:border-gray-800
    px-4
  ">
    <UiFlex class="h-[var(--header-size)] max-h-[var(--header-size)]">
      <LayoutManageNavSlide v-if="!isXL" class="mr-2 "/>
      
      <NuxtLink to="/manage/@eni">
        <UiText weight="bold" size="2xl" color="primary" class="italic hidden md:inline-block">
          Manage <span class="text-white text-base">Pannel</span>
        </UiText>
      </NuxtLink>
      
      <UiFlex justify="end" items="center" class="gap-1 ml-auto">
        <!-- <Setting /> -->

        <AuthHeader v-if="!!authStore.isLogin" />
        <SocketNavSlide />
        <NuxtLink to="/">
          <UButton  icon="i-bx-power-off" color="red" size="lg" square />
        </NuxtLink>
      </UiFlex>
    </UiFlex>
  </header>
</template>

<script setup>
const { isLG, isXL } = useSizeCustom()
const authStore = useAuthStore()
</script>