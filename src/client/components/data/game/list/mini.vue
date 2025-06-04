<template>
  <UiFlex type="col" class="divide-y !divide-gray-900">
    <UiFlex v-for="(game, index) in list" :key="index" class="w-full gap-4 py-2">
      <UAvatar :src="game.image?.icon" :alt="game.code" />

      <NuxtLink :to="`/game/${os}/${game.key}`" @click="emits('to')"  class="grow">
        <div>
          <UiText weight="semibold" class="text-gray-300 line-clamp-2 text-xs sm:text-sm hover:text-primary mb-1">
            {{ game.name }}
          </UiText>
      
          <UiFlex class="gap-1">
            <UBadge color="gray" size="xs" variant="soft" class="capitalize">Game {{ os }}</UBadge>
            <UBadge color="gray" size="xs" variant="soft">{{ game.platform.name }}</UBadge>
            <UBadge color="gray" size="xs" variant="soft">{{ game.category.name }}</UBadge>
          </UiFlex>
        </div>
      </NuxtLink>

      <NuxtLink :to="`/game/${os}/${game.key}`" @click="emits('to')" v-if="!noIcon">
        <UiIcon name="i-bx-link-external" size="5" color="gray" v-if="!play"></UiIcon>
        <UButton size="2xs" color="gray" icon="i-bx-play" v-else>Chơi</UButton>
      </NuxtLink>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['os', 'list', 'noIcon', 'showOs', 'play'])
const emits = defineEmits(['to'])
</script>