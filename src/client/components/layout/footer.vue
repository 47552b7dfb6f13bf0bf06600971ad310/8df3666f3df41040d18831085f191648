<template>
  <footer class="flex justify-between mt-12">
    <div class="text-xs font-semibold">
      <span class="text-gray-500 dark:text-gray-400 mr-1">{{configStore.config.short_name || '...'}} |</span>
      <span class="text-primary mr-1">{{year}}</span>
      <span class="text-gray-500 dark:text-gray-400">Copyright</span>
    </div>

    <div class="text-xs font-semibold">
      <span class="text-gray-500 dark:text-gray-400 mr-1">Make by</span>
      <span class="text-primary" v-if="configStore.config.contact.prefix">{{ configStore.config.contact.prefix }} Studio</span>
      <span class="text-primary" v-else>Raiden</span>
    </div>
  </footer>
</template>

<script setup>
const configStore = useConfigStore()
const year = computed(() => new Date().getFullYear())
</script>