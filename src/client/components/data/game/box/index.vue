<template>
  <NuxtLink :to="to">
    <UCard class="cursor-pointer" :ui="{
      divide: '',
      shadow: 'shadow',
      header: {
        padding: 'p-0 p-0 sm:p-0',
      },
      body: {
        padding: 'px-3 py-3 sm:p-4',
      },
      footer: {
        base: 'border-none',
        padding: 'px-3 py-0 pb-3 sm:px-4',
      }
    }">
      <template #header>
        <div class="relative overflow-hidden rounded-t-2xl">
          <UiImg :src="game.image?.banner" w="16" h="9" class="box-blue" />
          <UiIcon class="absolute top-2 left-2 jump-anim" v-if="!!game.pin" color="primary" name="i-bxs-star" size="5" />
        </div>
      </template>

      <template #default>
        <div class="GameRibbon pr-2 pl-1" v-if="os == 'china' && !!game.rate && !!game.rate.pay">
          <UiFlex type="col">
            <UiText style="font-size: 10px;" weight="semibold">Rate</UiText>
            <UiText size="xs" weight="semibold">{{ game.rate.pay }}</UiText>
          </UiFlex>
        </div>

        <div class="GameRibbon pr-2 pl-1" v-if="os == 'private' && !!game.rate && useRate().data(game.rate.shop).number > 0">
          <UiFlex type="col">
            <UiText style="font-size: 8px;" weight="semibold">Giảm</UiText>
            <UiText style="font-size: 11px;" weight="semibold">{{ useRate().data(game.rate.shop).number }}%</UiText>
          </UiFlex>
        </div>

        <UiFlex class="mb-1 gap-2">
          <UiText color="gray" style="font-size: 11px;">{{ game.platform.name }}</UiText>
          <UiDot color="gray" size="2"/>
          <UiText color="gray" style="font-size: 11px;">{{ game.category.name }}</UiText>
        </UiFlex>

        <UiText weight="bold" class="mb-0.5 line-clamp-1 text-sm sm:text-base text-gray-300 hover:text-primary">
          {{ game.name }}
        </UiText>
        
        <UiText color="gray" class="line-clamp-2 text-xs min-h-[32px]">
          <span v-if="!!game.server_name && !!game.opentime">Khai mở <b class="text-primary-400">{{ game.server_name }}</b> vào ngày <b class="text-primary-400">{{ useDayJs().displayFull(game.opentime) }}</b></span>
          <span v-else>{{ game.description }}</span>
        </UiText>
      </template>

      <template #footer>
        <UiFlex class="gap-1" justify="center">
          <UBadge size="xs" color="gray" variant="soft">
            <UiIcon name="i-bx-show" size="4"/>
            <UiText class="mx-0.5">{{ useMoney().miniMoney(game.statistic.view) }}</UiText>
          </UBadge>

          <UBadge size="xs" color="gray" variant="soft">
            <UiIcon name="i-bx-play" size="4"/>
            <UiText class="mx-0.5">{{ useMoney().miniMoney(game.statistic.play) }}</UiText>
          </UBadge>

          <UBadge size="xs" color="gray" variant="soft">
            <UiIcon name="i-bx-group" size="4"/>
            <UiText class="mx-0.5">{{ useMoney().miniMoney(game.statistic.user) }}</UiText>
          </UBadge>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['game', 'os', 'gm'])

const to = computed(() => {
  if(!props.gm) return `/game/${props.os}/${props.game?.key}`
  if(!!props.gm) return `/manage/@gm/${props.os}/${props.game?._id}`
})
</script>

<style lang="sass">
.GameRibbon
  position: absolute
  top: 0
  right: 5px
  --r:.8em
  min-width: 50px
  border-inline: .5em solid #0000
  padding: 0.5em 0.2em calc(var(--r) + .2em)
  clip-path: polygon(0 0, 100% 0, 100% 100%, calc(100% - .5em) 100%, 50% calc(100% - var(--r)), 0.5em 100%, 0 100%)
  background: radial-gradient(50% 0.2em at top, #000a, #0000) border-box, #eb4545 padding-box
  width: fit-content

.GameRibbon2
  position: absolute
  top: 0
  right: 40px
  --r:.8em
  min-width: 50px
  border-inline: .5em solid #0000
  padding: 0.5em 0.2em calc(var(--r) + .2em)
  clip-path: polygon(0 0, 100% 0, 100% 100%, calc(100% - .5em) 100%, 50% calc(100% - var(--r)), 0.5em 100%, 0 100%)
  background: radial-gradient(50% 0.2em at top, #000a, #0000) border-box, #12971d padding-box
  width: fit-content
</style>