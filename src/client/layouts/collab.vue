<template>
  <div class="relative h-full min-h-full pt-[var(--header-size)]">
    <LayoutCollabHeader :game="game" />

    <UiFlex class="px-4 py-4 lg:gap-6 gap-0" items="start">
      <div class="
        HideScroll
        sticky top-[calc(var(--header-size)+1rem)]
        bg-gray-1000 rounded-2xl
        min-h-[calc(100vh-2rem-var(--header-size))] max-h-[calc(100vh-2rem-var(--header-size))] overflow-y-auto
        lg:min-w-[250px] lg:max-w-[250px] lg:w-[250px]
        hidden lg:flex
      ">
        <LayoutCollabNav />
      </div>

      <UContainer 
        class="px-0 sm:px-0 lg:px-0 w-full" 
        style="min-height: calc(100% - var(--header-size));"
        :ui="{ constrained: 'max-w-[1800px] w-full overflow-x-hidden' }"
      >
        <slot></slot>
      </UContainer>
    </UiFlex>
  </div>
</template>

<script setup>
useSeoMeta({
  title: () => `Collab Pannel`,
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))
</script>