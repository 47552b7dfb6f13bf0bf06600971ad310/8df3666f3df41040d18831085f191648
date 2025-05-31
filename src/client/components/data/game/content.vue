<template>
  <UCard :ui="{ body: { padding: 'p-4 sm:p-4' }}">
    <UiContent title="Giới Thiệu" sub="Tổng quan thông tin về trò chơi" icon="i-material-symbols-news-outline-rounded">
      <DataEmpty class="h-[250px]" text="Không có thông tin" v-if="!game.content || game.content == '<p></p>'" />
      <UiEditorContent :content="game.content" v-else />
    </UiContent>
  </UCard>
</template>

<script setup>
const props = defineProps(['game'])
</script>