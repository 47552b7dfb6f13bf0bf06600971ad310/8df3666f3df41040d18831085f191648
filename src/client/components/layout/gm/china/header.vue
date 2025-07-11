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
    <NuxtLink :to="`/manage/@gm/china/${route.params._id}`" class="mr-auto">
      <UiText weight="bold" size="2xl" color="primary" class="italic">
        GM <span class="text-white text-base">Pannel</span>
      </UiText>
    </NuxtLink>

    <!-- <Setting /> -->
    <AuthHeader v-if="!!authStore.isLogin" />
    <SocketNavSlide class="hidden lg:flex" />
    <NuxtLink :to="`/game/china/${game.key}`">
      <UButton  icon="i-bx-power-off" color="red" size="lg" square />
    </NuxtLink>
  </header>
</template>

<script setup>
const props = defineProps(['game'])
const authStore = useAuthStore()
const route = useRoute()
</script>