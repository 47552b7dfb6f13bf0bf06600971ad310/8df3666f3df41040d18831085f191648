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
    <LazyLayoutPublicNavSlide v-if="!isXL" />
    
    <NuxtLink to="/" v-if="!!isXL">
      <UiLogo class="mr-4"/>
    </NuxtLink>

    <LayoutPublicHeaderSearch class="mr-auto"/>

    <LazyAuthSign v-if="!authStore.isLogin" />
    <LazyAuthHeader v-else />
    <LazySocketNavSlide v-if="!isLG" />
  </header>
</template>

<script setup>
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 430 })
const isLG = breakpoints.greaterOrEqual('lg')
const isXL = breakpoints.greaterOrEqual('xl')
const authStore = useAuthStore()
</script>