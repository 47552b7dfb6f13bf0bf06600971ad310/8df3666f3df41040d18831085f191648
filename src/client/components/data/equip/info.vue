<template>
  <div>
    <DataEmpty v-if="!source" text="Chưa có trang bị" class="min-h-[300px]" />

    <UiFlex class="gap-4" items="start" v-else>
      <UiFlex type="col" class="max-w-[30%]">
        <DataCharacterView :source="data" view="info" class="w-full bg-gray rounded-2xl" />
        <slot name="right"></slot>
      </UiFlex>

      <UiFlex type="col" class="gap-4 relative grow">
        <UiFlex justify="between" class="w-full gap-2">
          <UiText weight="semibold" color="gray" size="xs">Tên</UiText>
          <UiText weight="semibold" size="xs">{{ source.name }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full gap-2">
          <UiText weight="semibold" color="gray" size="xs">Giới tính</UiText>
          <UiText weight="semibold" size="xs">{{ source.sex == 0 ? 'Tất cả' : source.sex == 1 ? 'Nam' : 'Nữ' }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full gap-2">
          <UiText weight="semibold" color="gray" size="xs">Lực chiến</UiText>
          <UiText weight="semibold" size="xs" color="green">{{ useMoney().toMoney(power || source.power) }}</UiText>
        </UiFlex>

        <UiFlex justify="between" class="w-full gap-2" v-if="level == 0 || !!level">
          <UiText weight="semibold" color="gray" size="xs">Cường hóa</UiText>
          <UiText weight="semibold" size="xs" color="yellow">+{{ level }}</UiText>
        </UiFlex>

        <slot></slot>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['source', 'level', 'power', 'type'])

const data = computed(() => {
  if(!props.source) return null
  if(!props.type) return null
  const result = {}
  result[props.type] = props.source
  return result
})
</script>