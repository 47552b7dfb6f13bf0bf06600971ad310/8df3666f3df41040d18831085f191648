<template>
  <div class="divide-y divide-gray-100 dark:divide-gray-800">
    <UiFlex class="gap-4 py-6" items="start" v-for="(comment, index) in list" :key="index">
      <DataUserAvatar size="md" :user="comment.user" v-if="!!comment.user"/>

      <div class="w-full">
        <UiFlex class="gap-1 mb-2">
          <DataUserName :user="comment.user" size="sm" />
          <UiText color="gray" size="xs" class="ml-auto max-md:hidden">{{ useDayJs().displayFull(comment.createdAt) }}</UiText>
        </UiFlex>

        <UiEditorContent :content="comment.content" class="max-md:hidden"></UiEditorContent>
        
        <div class="bg-gray p-2 px-3 rounded-r-2xl rounded-bl-2xl text-left md:hidden">
          <UiEditorContent :content="comment.content"></UiEditorContent>
          <UiText color="gray" size="xs" class="mt-2">{{ useDayJs().displayFull(comment.createdAt) }}</UiText>
        </div>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['list'])
</script>