<template>
  <div>
    <DataEmpty v-if="!source" text="Chưa có trang bị" class="min-h-[300px]" />

    <div v-else>
      <DataCharacterView :source="data" view="info" class="bg-gray rounded-2xl mb-4" />

      <UiFlex type="col" class="gap-4 relative">
        <UiFlex justify="between" class="w-full gap-2">
          <UiText weight="semibold" color="gray" size="xs">Tên</UiText>
          <UiText weight="semibold" size="xs">{{ source.name }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full gap-2">
          <UiText weight="semibold" color="gray" size="xs">Mô tả</UiText>
          <UiText weight="semibold" size="xs">{{ source.name }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full gap-2">
          <UiText weight="semibold" color="gray" size="xs">Lực chiến</UiText>
          <UiText weight="semibold" size="xs">{{ source.power }}</UiText>
        </UiFlex>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['source', 'level', 'type'])

const data = computed(() => {
  if(!props.source) return null
  if(!props.type) return null
  const result = {}
  result[props.type] = props.source
  return result
})
</script>