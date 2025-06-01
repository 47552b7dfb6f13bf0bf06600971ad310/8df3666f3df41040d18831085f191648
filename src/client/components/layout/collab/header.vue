<template>
  <header class=" 
    fixed safe-area-top
    top-0 left-0 z-50 
    w-full
    bg-gray-1000 
    flex items-center
    h-[var(--header-size)] max-h-[var(--header-size)]
    px-4
    md:gap-1 gap-0.5
  ">
    <LayoutCollabNavSlide class="flex lg:hidden" />
    
    <NuxtLink :to="`/manage/@collab/${route.params._code}`" class="mr-auto">
      <UiText weight="bold" size="2xl" color="primary" class="italic hidden md:inline-block">
        Collab <span class="text-white text-base">Pannel</span>
      </UiText>
    </NuxtLink>

    <LazyAuthSign v-if="!authStore.isLogin" />
    <LazyAuthHeader v-else />
    <SocketNavSlide />
    <NuxtLink to="/">
      <UButton  icon="i-bx-power-off" color="red" size="lg" square />
    </NuxtLink>
  </header>
</template>

<script setup>
const props = defineProps(['game'])
const authStore = useAuthStore()
const route = useRoute()
</script>