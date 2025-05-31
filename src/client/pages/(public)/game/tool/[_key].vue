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
          <NuxtLink to="/game/tool">
            <UBadge color="gray" variant="soft">Game Tool</UBadge>
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
          <UButton icon="i-bx-play" color="yellow" size="lg" class="grow justify-center" @click="action('play')">Chơi Ngay</UButton>
          <UButton icon="i-bx-cart" color="gray" size="lg" class="grow justify-center" @click="action('buy')">Mua Tool</UButton>
          <UButton 
            icon="i-bx-shield-quarter" 
            square size="lg"
            color="gray"
            @click="navigateTo(`/manage/@gm/tool/${game._id}`)"
            v-if="!!authStore.isLogin && (!!authStore.isAdmin || (!!game.manager && !!game.manager.includes(authStore.profile._id)))"
          ></UButton>
        </UiFlex>
      </UiFlex>
    </div>

    <!-- <UiFlex justify="between" class="mb-3">
      <UiText weight="semibold" color="gray" size="sm">Tool nạp</UiText>
      <UiText weight="semibold" size="sm" color="primary">{{ toMoney(game.price.recharge)+' Xu' }}</UiText>
    </UiFlex>

    <UiFlex justify="between" class="mb-3">
      <UiText weight="semibold" color="gray" size="sm">Tool thư</UiText>
      <UiText weight="semibold" size="sm" color="primary">{{ toMoney(game.price.mail)+' Xu' }}</UiText>
    </UiFlex> -->

    <!--Content-->
    <div class="grid grid-cols-12 gap-2 @3xl:gap-4 mb-2">
      <div class="@5xl:col-span-8 @3xl:col-span-7 col-span-12">
        <DataGameToolMenu :game="game" />
        <DataGameContent :game="game" class="mt-2 @3xl:block hidden"/>
      </div>

      <div class="@5xl:col-span-4 @3xl:col-span-5 col-span-12">
        <!--Mini Info-->
        <UiFlex type="col" class="mb-2" v-if="!!configStore.config.social.game.tool || !!game.newserver">
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

          <UAlert title="Hỗ trợ" icon="i-bx-support" color="green" class="box-green" variant="soft" v-if="!!configStore.config.social.game.tool">
            <template #description>
              <UiText class="text-white">
                Tham gia <b class="cursor-pointer text-green-400 decoration-1" @click="useTo().openNewTab(configStore.config.social.game.tool)">nhóm Zalo Game Tool</b> để được hỗ trợ kịp thời
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>
        </UiFlex>

        <!--News-->
        <DataGameNews :game="game" os="tool" />
      </div>
    </div>

    <!--Content & Related-->
    <div class="grid grid-cols-12 gap-2 @3xl:gap-4">
      <div class="@5xl:col-span-8 @3xl:col-span-7 col-span-12">
        <DataGameComment :game="game" os="tool" />
      </div>

      <div class="@5xl:col-span-4 @3xl:col-span-5 col-span-12">
        <DataGameRelated :platform="[game.platform._id]" :category="[game.category._id]" :skip="game._id" os="tool"/>
      </div>
    </div>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close>
      <DataGameStart :game="game" :loading="loading.play" @close="modal.play = false" @play="playUrl" />
    </UModal>

    <!--Buy Tool-->
    <UModal v-model="modal.buy" prevent-close>
      <DataGameToolBuy :game="game" @close="modal.buy = false" @done="doneBuyTool" />
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const { miniMoney, toMoney } = useMoney()
const { openNewTab } = useTo()
const { img } = useMakeLink()
const authStore = useAuthStore()
const route = useRoute()
const game = ref({
  name: '',
  description: '',
  image: {
    banner: null
  }
})

useSeoMeta({
  title: () => `${game.value.name} - Game Tool - ${configStore.config.name}`,
  ogTitle: () => `${game.value.name} - Game Tool - ${configStore.config.name}`,
  description: () => game.value.description,
  ogDescription: () => game.value.description,
  ogImage: () => img(game.value.image.banner), 
  ogImageAlt: () => game.value.name,
})

const loading = ref({
  page: true,
  play: false
})

const modal = ref({
  buy: false,
  play: false,
})




const onTabChange = (index) => {
  const tabSelect = tabs[index]
  navigateTo(`/game/tool/${route.params._key}/${tabSelect.to}`)
}

const action = (key) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  modal.value[key] = true
}

const doneBuyTool = (state) => {
  modal.value.buy = false
}
 
const playUrl = async (type) => {
  try {
    loading.value.play = true

    const data = await useAPI('game/tool/public/project/play/start', { 
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
      const path = `/game/tool/play?${queryString}`
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

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/tool/public/project/key', {
      key: route.params._key
    })

    game.value = data
    loading.value.page = false
  }
  catch(e){
    return false
  }
}

watch(() => authStore.isLogin, (val) => getGame())
getGame()
</script>