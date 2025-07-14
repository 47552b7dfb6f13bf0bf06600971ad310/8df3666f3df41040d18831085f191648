<template>
  <div class="@container grid grid-cols-12 gap-4">
    <div class="@3xl:col-span-6 col-span-12">
      <DataGameReview :review="game.image.review" :banner="game.image.banner" />
    </div>

    <UiFlex type="col" items="start" class="@3xl:col-span-6 col-span-12">
      <UiFlex justify="between" items="start" class="gap-2 w-full">
        <div class="grow">
          <UiText weight="bold" class="text-2xl @5xl:text-3xl mb-1">{{ game.name }}</UiText>
          <UiText color="gray" class="text-md @5xl:text-lg line-clamp-1 mb-2">{{ game.description }}</UiText>
        </div>

        <ManageGamePrivateAction :game="game" @update="emits('update')" />
      </UiFlex>

      <!-- Tab -->
      <UiFlex wrap class="gap-1 w-full mb-4">
        <NuxtLink to="/game/private">
          <UBadge color="gray" variant="soft">Game Private</UBadge>
        </NuxtLink>
        
        <NuxtLink :to="`/game/platform/${game.platform.key}`">
          <UBadge color="gray" variant="soft">{{ game.platform.name }}</UBadge>
        </NuxtLink>
        
        <NuxtLink :to="`/game/category/${game.category.key}`">
          <UBadge color="gray" variant="soft">{{ game.category.name }}</UBadge>
        </NuxtLink>
      </UiFlex>

      <!-- Statistic -->
      <div class="grid grid-cols-12 gap-2 w-full grow">
        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">{{ miniMoney(game.statistic.view) }}</UiText>
          <UiText color="gray" size="xs" align="center">Lượt xem</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">{{ miniMoney(game.statistic.play) }}</UiText>
          <UiText color="gray" size="xs" align="center">Lượt chơi</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">{{ miniMoney(game.statistic.user) }}</UiText>
          <UiText color="gray" size="xs" align="center">Người chơi</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">{{ toMoney(game.statistic.revenue) }}</UiText>
          <UiText color="gray" size="xs" align="center">Doanh thu</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">- {{ useRate().data(game.rate.shop).number }}%</UiText>
          <UiText color="gray" size="xs" align="center">Giảm giá</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">- {{ game.rate.shop.vip.month }}%</UiText>
          <UiText color="gray" size="xs" align="center">VIP tháng</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">- {{ game.rate.shop.vip.forever }}%</UiText>
          <UiText color="gray" size="xs" align="center">VIP trọn đời</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">{{ toMoney(game.rate.wheel) }} Xu / lượt</UiText>
          <UiText color="gray" size="xs" align="center">Vòng quay</UiText>
        </UiFlex>

        <UiFlex type="col" class="col-span-4 bg-gray-1000 rounded-2xl p-2" justify="center">
          <UiText size="sm" weight="semibold" align="center" class="mb-1">{{ useDayJs().fromTime(game.updatedAt) }}</UiText>
          <UiText color="gray" size="xs" align="center">Cập nhật</UiText>
        </UiFlex>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['update'])
const { miniMoney, toMoney } = useMoney()
</script>