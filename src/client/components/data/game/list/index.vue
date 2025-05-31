<template>
  <DataEmpty class="h-[250px]" :loading="loading" v-if="!!loading || list.length == 0" />

  <div v-else class="@container grid grid-cols-12 gap-2 md:gap-4">
    <DataGameBox 
      v-for="(item, index) in list" 
      :key="index" 
      class="@4xl:col-span-3 @2xl:col-span-4 col-span-6"
      :game="item"
      :os="os"
      :gm="gm"
    />
  </div>
</template>

<script setup>
const props = defineProps(['loading', 'list', 'os', 'gm'])
</script>