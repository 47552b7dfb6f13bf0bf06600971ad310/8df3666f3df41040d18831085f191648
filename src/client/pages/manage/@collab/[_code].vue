<template>
  <NuxtPage></NuxtPage>
</template>

<script setup>
definePageMeta({
  layout: 'collab',
  middleware: 'collab'
})

const route = useRoute()
</script>