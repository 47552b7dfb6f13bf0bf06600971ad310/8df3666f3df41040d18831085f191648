<template>
  <div class="relative h-full min-h-full">
    <LayoutManageHeader />

    <div class="
      grid grid-cols-12 gap-0 
      min-h-[calc(100%-var(--header-size))]
    ">
      <div v-if="!!isXL" class="
        xl:col-span-2 col-span-12
        xl:sticky xl:top-[var(--header-size)]
        xl:max-h-[calc(100vh-var(--header-size))] xl:overflow-y-auto
        border-r border-gray-100 dark:border-gray-800
        bg-gray-1000
        p-4
      ">
        <LayoutManageNav />
      </div>
      
      <div class="xl:col-span-10 col-span-12">
        <UContainer 
          class="relative p-4 sm:p-4 lg:p-4" 
          :ui="{ constrained: 'max-w-[1800px] w-full overflow-x-hidden' }"
        >
          <slot></slot>
        </UContainer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 430 })
const isLG = breakpoints.greaterOrEqual('lg')
const isXL = breakpoints.greaterOrEqual('xl')

useSeoMeta({
  title: () => `Manage Pannel`,
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && navigateTo('/'))
</script>