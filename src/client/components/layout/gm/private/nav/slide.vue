<template>
  <UiFlex>
    <UButton color="gray" icon="i-bx-menu-alt-left" size="lg" square @click="open = true" />

    <USlideover v-model="open" side="left" class="safe-area-top" :ui="{
      width: 'w-screen max-w-[var(--nav-size)]'
    }">
      <UiFlex type="col" justify="center" class="bg-card py-4 overflow-hidden h-full">
        <NuxtLink :to="`/manage/@gm/private/${route.params._id}`">
          <UiText weight="bold" size="2xl" color="primary" class="italic" @click="open = false">
            GM <span class="text-white text-base">Pannel</span>
          </UiText>
        </NuxtLink>
      
        <div class="overflow-y-auto w-full grow">
          <LayoutGmPrivateNav @to="open = false" /> 
        </div>
      </UiFlex>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['game'])
const open = ref(false)
const route = useRoute()
</script>