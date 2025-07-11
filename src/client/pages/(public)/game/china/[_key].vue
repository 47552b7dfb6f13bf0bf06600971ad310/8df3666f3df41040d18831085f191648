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
          <NuxtLink to="/game/china">
            <UBadge color="gray" variant="soft">Game China</UBadge>
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
          <UButton icon="i-bx-play" :color="!!game.user ? 'yellow' : 'green'" size="lg" class="grow justify-center" @click="checkChinaAccount" :loading="loading.account">
            {{ !!game.user ? 'Chơi Ngay' : 'Đăng Ký Chơi' }}
          </UButton>
          <UButton icon="i-bxs-credit-card" color="gray" size="lg" class="grow justify-center" @click="openPayment">Nạp Tệ</UButton>
          <UButton 
            icon="i-bx-shield-quarter" 
            square size="lg"
            color="gray"
            @click="navigateTo(`/manage/@gm/china/${game._id}`)"
            v-if="!!authStore.isLogin && (!!authStore.isAdmin || (!!game.manager && !!game.manager.includes(authStore.profile._id)))"
          ></UButton>
        </UiFlex>
      </UiFlex>
    </div>

    <!--Content-->
    <div class="grid grid-cols-12 gap-2 @3xl:gap-4 mb-2">
      <div class="@5xl:col-span-8 @3xl:col-span-7 col-span-12">
        <!--Mini Info-->
        <UiFlex type="col" class="gap-1 mb-2">
          <UAlert title="Thông báo" icon="i-bxs-discount" color="rose" class="box-red" variant="soft" v-if="!!game.rate.pay">
            <template #description>
              <UiText class="text-white">
                Tỷ lệ <b class="text-rose-400">nạp</b> trong trò chơi là <b class="text-rose-400">{{ game.rate.pay }}</b>
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>

          <UAlert title="Chú ý" icon="i-bxs-info-circle" color="primary" class="box-blue" variant="soft">
            <template #description>
              <UiText class="text-white">
                Vui lòng đọc kỹ <b class="cursor-pointer text-primary-400 decoration-1" @click="modal.tutorial = true">hướng dẫn</b> trước khi chơi và nạp tiền nền tảng để đảm bảo trải nghiệm trò chơi tốt nhất.
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>

          <UAlert title="Hỗ trợ" icon="i-bx-support" color="green" class="box-green" variant="soft" v-if="configStore.config.social.game.china">
            <template #description>
              <UiText class="text-white">
                Tham gia <b class="cursor-pointer text-green-400 decoration-1" @click="useTo().openNewTab(configStore.config.social.game.china)">nhóm Zalo Game China</b> để được hỗ trợ kịp thời
              </UiText>
            </template>

            <template #icon="{ icon }">
              <UiIcon :name="icon" size="10"/>
            </template>
          </UAlert>
        </UiFlex>

        <!--News-->
        <DataGameContent :game="game" class="mt-2"/>
      </div>

      <div class="@5xl:col-span-4 @3xl:col-span-5 col-span-12">
        <DataGameComment :game="game" os="china" class="mb-2" />
        <DataGameRelated :platform="[game.platform._id]" :category="[game.category._id]" :skip="game._id" os="china"/>
      </div>
    </div>

    <!--Play-->
    <UModal v-model="modal.play" prevent-close>
      <DataGameStart :game="game" :loading="loading.play" @close="modal.play = false" @play="playUrl" os="china" />
    </UModal>

    <!--Account-->
    <UModal v-model="modal.account" prevent-close>
      <UiContent no-dot title="China Account" sub="Xác nhận tài khoản game trung" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="loading.account" @click="modal.account = false"></UButton>
        </template>

        <UForm :state="stateChina" @submit="signChinaAccount">
          <UFormGroup label="Mật khẩu tài khoản">
            <UInput icon="i-bxs-lock" v-model="stateChina.password" type="password"/>
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" size="md" :loading="loading.account" color="yellow">Xác Nhận</UButton>
            <UButton color="gray" size="md" :disabled="loading.account" @click="modal.account = false">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent> 
    </UModal>

    <!--Payment-->
    <UModal v-model="modal.payment" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <DataGameChinaPayment :game="game" @close="modal.payment = false" class="p-4" /> 
    </UModal>

    <!--Tutorial-->
    <UModal v-model="modal.tutorial" :ui="{width: 'sm:max-w-[900px]'}">
      <DataGameChinaTutorial @close="modal.tutorial = false"/> 
    </UModal>
  </div>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const { miniMoney } = useMoney()
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
  title: () => `${game.value.name} - Game China - ${configStore.config.name}`,
  ogTitle: () => `${game.value.name} - Game China - ${configStore.config.name}`,
  description: () => game.value.description,
  ogDescription: () => game.value.description,
  ogImage: () => new URL(game.value.image.banner || '/images/null.webp', runtimeConfig.public.clientURL),  
  ogImageAlt: () => game.value.name,
})

const loading = ref({
  page: true,
  play: false,
  account: false
})
const modal = ref({
  tutorial: false,
  play: false,
  account: false,
  payment: false
})

const stateChina = ref({
  password: null
})

watch(() => authStore.isLogin, () => getGame())

const openPayment = async () => {
  if(!authStore.isLogin) return authStore.setModal(true)
  if(!game.value.user) return useNotify().error('Vui lòng chơi game trước khi nạp')
  modal.value.payment = true
}

const checkChinaAccount = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)
    loading.value.account = true

    const data = await useAPI('game/china/public/sign/check')
    loading.value.account = false

    if(!!data) return modal.value.play = true
    else return modal.value.account = true
  }
  catch(e){
    loading.value.account = false
  }
}

const signChinaAccount = async () => {
  try {
    loading.value.account = true
    await useAPI('game/china/public/sign/youxi', JSON.parse(JSON.stringify(stateChina.value)))

    loading.value.account = false
    modal.value.account = false
    modal.value.play = true
    stateChina.value.password = null
  }
  catch(e){
    loading.value.account = false
  }
}
 
const playUrl = async (type) => {
  try {
    loading.value.play = true

    const data = await useAPI('game/china/public/project/play', { 
      game: game.value.code,
      type: type
    })
    loading.value.play = false
    modal.value.play = false

    getGame()
    useTo().openNewTab(data.url)
  }
  catch(e){
    loading.value.play = false
  }
}

const getGame = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('game/china/public/project/key', {
      key: route.params._key
    })

    game.value = data
    loading.value.page = false
  }
  catch(e){
    return false
  }
}
getGame()

onMounted(() => {
  const disabledAutoShowTutorialChina = useCookie('disabled-auto-show-tutorial-china', runtimeConfig.public.cookieConfig)
  if(!disabledAutoShowTutorialChina.value) modal.value.tutorial = true
})
</script>