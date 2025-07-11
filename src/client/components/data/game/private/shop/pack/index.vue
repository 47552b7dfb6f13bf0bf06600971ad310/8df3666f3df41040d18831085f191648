<template>
  <div>
    <UiFlex class="mb-2 md:gap-2 gap-1" justify="between">
      <UForm :state="page" @submit="page.current = 1, getList()" class="w-full">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="lg" />
      </UForm>

      <DataPaymentFast v-if="game.user" :custom="true">
        <template #default="{ toggle }">
          <DataUserCoin @click="toggle()" />
        </template>
      </DataPaymentFast>
    </UiFlex>

    <DataEmpty class="h-[300px]" text="Không có gói vật phẩm nào bày bán" :loading="loading" v-if="!!loading || list.length == 0" />

    <div v-else>
      <div class="@container grid grid-cols-12 gap-1 HideScroll max-h-[60vh] overflow-y-auto">
        <UCard 
          v-for="(shop, index) in list" :key="index" 
          class="bg-gray @4xl:col-span-3 @xl:col-span-4 col-span-6 cursor-pointer" 
          @click="startBuy(shop)"
        >
          <UiFlex type="col">
            <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mb-4 max-w-[90%]">
              {{ shop.name || 'Gói Vật Phẩm' }}
            </UiText>

            <DataGamePrivateItemList :items="shop.gift" justify="center" size="50" class="my-1" :max="2" :game="game.code"/>

            <UiText size="xs" weight="semibold" class="line-clamp-1 my-4" color="gray">{{ shop.gift.length }} Vật Phẩm</UiText>

            <UButton color="gray" class="px-4 md:px-6 max-w-full">
              {{ useMoney().miniMoney(shop.price) }}
              <UiIcon name="i-game-icons-two-coins" class="ml-1" size="5"/>
            </UButton>
          </UiFlex>
        </UCard>
      </div>

      <!-- Pagination -->
      <UiFlex justify="end" class="mt-2">
        <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
      </UiFlex>
    </div>

    <UModal v-model="modal.buy" prevent-close>
      <DataGamePrivateShopPackBuy :shop="shopSelect" :game="game" @close="modal.buy = false" @done="modal.buy = false, emits('done')" />
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game'])
const emits = defineEmits(['done'])

const list = ref([])
const loading = ref(true)

const modal = ref({
  buy: false
})

const page = ref({
  size: 6,
  current: 1,
  sort: {
    column: 'price',
    direction: 'asc'
  },
  search: null,
  total: 0,
  game: props.game?.code
})
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const shopSelect = ref(undefined)

const startBuy = (shop) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  if(!props.game.user) return useNotify().error('Vui lòng đăng ký chơi trước')
  shopSelect.value = shop
  modal.value.buy = true
}

const getList = async () => {
	try {
    loading.value = true
    const data = await useAPI('game/private/public/shop/pack/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value = false
	}
	catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>