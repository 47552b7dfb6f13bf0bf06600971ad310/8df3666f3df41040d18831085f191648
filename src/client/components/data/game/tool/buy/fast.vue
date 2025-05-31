<template>
  <UiFlex>
    <UButton size="2xs" class="color-blue-light bg-anim-light" icon="i-bxs-cart" @click="open = true">Mua Tool</UButton>

    <UModal v-model="open" preventClose>
      <DataGameToolBuy :game="game" @close="open = false" @done="open = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['game'])
const open = ref(false)
</script>