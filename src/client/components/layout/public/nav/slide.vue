<template>
  <UiFlex>
    <UButton color="gray" icon="i-bx-menu-alt-left" size="lg" square @click="open = true" />

    <USlideover v-model="open" side="left" class="safe-area-top" :ui="{
      width: 'w-screen max-w-[var(--nav-size)]'
    }">
      <UiFlex type="col" justify="center" class="bg-card py-4 overflow-hidden h-full">
        <NuxtLink to="/">
          <UiLogo class="mb-4" @click="open = false"/>
        </NuxtLink>
      
        <div class="overflow-y-auto w-full grow">
          <LayoutPublicNav @to="open = false" /> 
        </div>
      </UiFlex>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>