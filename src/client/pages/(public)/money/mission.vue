<template>
  <div>
    <UiMinibanner title="Nhiệm Vụ" sub="Hoàn thành các nhiệm vụ để nhận về ECoin tương ứng" type="mission" class="mb-4" />
    <DataMissionList />
  </div>
</template>

<script setup>
const configStore = useConfigStore()

useSeoMeta({
  title: () => `Nhiệm Vụ - ${configStore.config.name}`,
  ogTitle: () => `Nhiệm Vụ - ${configStore.config.name}`,
  description: () => `Hoàn thành các nhiệm vụ để nhận về ECoin tương ứng`,
  ogDescription: () => `Hoàn thành các nhiệm vụ để nhận về ECoin tương ứng`,
})
</script>