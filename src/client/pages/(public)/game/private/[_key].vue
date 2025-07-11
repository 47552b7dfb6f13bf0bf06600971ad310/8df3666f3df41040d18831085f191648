<template>
  <DataEmpty loading class="min-h-[300px]" v-if="!!loading.page"/>

  <div class="@container" v-else>
    <!-- Info -->
    <div class="grid grid-cols-12 gap-2 @3xl:gap-4 mb-4">
      <div class="@5xl:col-span-5 @3xl:col-span-6 col-span-12">
        <DataGameReview :review="game.image.review" :banner="game.image.banner" />
      </div>

      <UiFlex type="col" items="start" class="@5xl:col-span-7 @3xl:col-span-6 col-span-12">
        <UiText weight="bold" class="text-2xl @5xl:text-3xl mb-1">{{ game.name }}</UiText>
        <UiText color="gray" class="text-md @5xl:text-lg line-clamp-1 mb-2">{{ game.description }}</UiText>

        <!-- Tab -->
        <UiFlex wrap class="gap-1 w-full">
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
        <UiFlex class="my-6 w-full grow" justify="center">
          <UiFlex type="col" class="grow">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.view) }}</UiText>
            <UiText color="gray" size="xs">Lượt xem</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.play) }}</UiText>
            <UiText color="gray" size="xs">Lượt chơi</UiText>
          </UiFlex>

          <UiFlex type="col" class="grow">
            <UiText size="sm" weight="semibold">{{ miniMoney(game.statistic.user) }}</UiText>
            <UiText color="gray" size="xs">Người chơi</UiText>
          </UiFlex>
        </UiFlex>

        <!-- Button -->
        <UiFlex class="gap-1 w-full mt-auto">
          <UButton icon="i-bx-play" color="green" size="lg" class="grow justify-center" @click="regGame" :loading="loading.reg" v-if="!game.user">Đăng Ký Chơi</UButton>
          <UButton icon="i-bx-play" color="yellow" size="lg" class="grow justify-center" @click="action('play')" v-else>Chơi Ngay</UButton>
          <UButton icon="i-bx-barcode" color="gray" size="lg" class="grow justify-center" @click="action('giftcode')">Giftcode</UButton>
          <UButton 
            icon="i-bx-shield-quarter" 
            square size="lg"
            color="gray"
            @click="navigateTo(`/manage/@gm/private/${game._id}`)"
            v-if="!!authStore.isLogin && (!!authStore.isAdmin || (!!game.manager && !!game.manager.includes(authStore.profile._id)))"
          ></UButton>
        </UiFlex>
      </UiFlex>
    </div>

    <!--Content-->
    <div class="grid grid-cols-12 gap-2 @3xl:gap-4 mb-2">
      <div class="@5xl:col-span-8 @3xl:col-span-7 col-span-12">
        <DataGamePrivateMenu :game="game" />
        <DataGameContent :game="game" class="mt-2 @3xl:block hidden"/>
      </div>

      <div class="@5xl:col-span-4 @3xl:col-span-5 col-span-12">
        <!--Mini Info-->
        <UiFlex type="col" class="mb-2" v-if="!!configStore.config.social.game.private || !!game.newserver || useRate().data(game.rate.shop).number > 0">
          <UAlert title="Máy chủ mới nhất" icon="i-bxs-party" color="primary" class="box-blue" variant="soft" v-if="!!game.newserver">
            <template #description>
              <UiText class="text-white">
                Khai mở <b class="text-primary-400">{{ game.newserver.server_name }}</b> vào ngày <b class="text-primary-400">{{ useDayJs().displayFull(game.newserver.opentime) }}</b>
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>

          <UAlert title="Khuyến mãi" icon="i-bxs-discount" color="rose" class="box-red" variant="soft" v-if="useRate().data(game.rate.shop).number > 0">
            <template #description>
              <UiText class="text-white">
                Trò chơi được <b class="text-rose-400">giảm giá</b> mua tại cửa hàng <b class="text-rose-400">{{ useRate().data(game.rate.shop).number }}%</b>
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>

          <UAlert title="Hỗ trợ" icon="i-bx-support" color="green" class="box-green" variant="soft" v-if="!!configStore.config.social.game.private">
            <template #description>
              <UiText class="text-white">
                Tham gia <b class="cursor-pointer text-green-400 decoration-1" @click="useTo().openNewTab(configStore.config.social.game.private)">nhóm Zalo Game Private</b> để được hỗ trợ kịp thời
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>
        </UiFlex>

        <!--Content-->
        <DataGameContent :game="game" class="@3xl:hidden mb-2"/>

        <!--News-->
        <DataGameNews :game="game" os="private" />
      </div>
    </div>

    <!--Content & Related-->
    <div class="grid grid-cols-12 gap-2 @3xl:gap-4">
      <div class="@5xl:col-span-8 @3xl:col-span-7 col-span-12">
        <DataGameComment :game="game" os="private" />
      </div>

      <div class="@5xl:col-span-4 @3xl:col-span-5 col-span-12">
        <DataGameRelated :platform="[game.platform._id]" :category="[game.category._id]" :skip="game._id" os="private"/>
      </div>
    </div>

    <!--Giftcode-->
    <UModal v-model="modal.giftcode" prevent-close :ui="{width: 'sm:max-w-[600px]'}">
      <DataGamePrivateGiftcode :game="game" @close="modal.giftcode = false" class="bg-card rounded-2xl p-4" /> 
    </UModal>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close>
      <DataGameStart :game="game" :loading="loading.play" @close="modal.play = false" @play="playUrl" />
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const authStore = useAuthStore()
const gameStore = useGameStore()
const { miniMoney } = useMoney()
const { openNewTab } = useTo()
const route = useRoute()
const game = ref({
  name: '',
  description: '',
  image: {
    banner: null
  }
})

useSeoMeta({
  title: () => `${game.value.name} - Game Private - ${configStore.config.name}`,
  ogTitle: () => `${game.value.name} - Game Private - ${configStore.config.name}`,
  description: () => game.value.description,
  ogDescription: () => game.value.description,
  ogImage: () => new URL(game.value.image.banner || '/images/null.webp', runtimeConfig.public.clientURL), 
  ogImageAlt: () => game.value.name,
})

const loading = ref({
  page: true,
  reg: false,
  play: false,
  giftcode: false
})

const modal = ref({
  play: false,
  giftcode: false
})

const action = (key) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value[key] = true
}

const playUrl = async (type) => {
  try {
    loading.value.play = true

    const data = await useAPI('game/private/public/project/play/start', { 
      game: game.value.code,
      type: type
    })

    loading.value.play = false
    modal.value.play = false

    // Play In Web
    if(!!data.token){
      const params = {
        token: data.token,
        game: game.value.code,
        collab: useCollab().getCode()
      }

      const queryString = new URLSearchParams(params).toString()
      const path = `/game/private/play?${queryString}`
      const link = `http://play.${runtimeConfig.public.domain}${path}`
      return openNewTab(!!runtimeConfig.public.dev ? path : link)
    }

    // Download
    if(!!data.download){
      return openNewTab(data.download)
    }
  }
  catch(e){
    loading.value.play = false
  }
}

const regGame = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    loading.value.reg = true
    const data = await useAPI('game/private/public/project/reg', {
      game: game.value.code
    })

    game.value.user = data
    loading.value.reg = false
  }
  catch(e){
    loading.value.reg = false
  }
}

const getUser = async () => {
  try {
    if(!authStore.isLogin) return
    
    const data = await useAPI('game/private/public/user/get', {
      game: game.value.code
    })

    game.value.user = data
    await authStore.setAuth()
  }
  catch(e){
    return false
  }
}

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/private/public/project/key', {
      key: route.params._key
    })
    game.value = data

    await getUser()
    loading.value.page = false
  }
  catch(e){
    return false
  }
}

watch(() => authStore.isLogin, (val) => getGame())
watch(() => gameStore.action.private.shop.buy, (val) => getUser())
watch(() => gameStore.action.private.event.receive, (val) => getUser())
getGame()
</script>