<template>
  <UiContent no-dot title="Tool Nạp" sub="Chức năng nạp trong game" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" square :disabled="loading" color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
    </template>

    <DataEmpty  v-if="!!game.paygame" class="h-[300px]" :text="'Trò chơi có thể nạp trực tiếp trong game'" />
    
    <div v-else>
      <UiFlex class="mb-2 gap-1" justify="between">
        <UForm :state="page" @submit="page.current = 1, getList()" class="w-full">
          <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="lg" />
        </UForm>
      </UiFlex>

      <DataEmpty class="h-[300px]" text="Không có gói nạp nào trong Tool" :loading="loading" v-if="!!loading || list.length == 0" />

      <div v-else>
        <div class="@container grid grid-cols-12 gap-1 HideScroll max-h-[60vh] overflow-y-auto">
          <UCard 
            v-for="(item, index) in list" :key="index" 
            class="bg-gray @4xl:col-span-3 @xl:col-span-4 col-span-6 cursor-pointer" 
            @click="startBuy(item)"
          >
            <UiFlex type="col">
              <UiImg 
                src="/images/icon/recharge.png"
                :img-w="160"
                :img-h="160"
                w="1" h="1" 
                img-size="200px"
                class="
                  transition-all 
                  rounded-2xl 
                  overflow-hidden
                  p-1
                "
                :style="{
                  minWidth: '80px',
                  minHeight: '80px',
                  width: '80px',
                  height: '80px',
                  maxWidth: '80px',
                  maxHeight: '80px',
                }"
              ></UiImg>

              <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mt-4 mb-0.5 max-w-[90%]">
                {{ item.recharge_name || 'Gói Nạp' }}
              </UiText>
              <UiText size="xs" weight="semibold" class="line-clamp-1" color="gray">Nạp Game</UiText>
            </UiFlex>
          </UCard>
        </div>

        <!-- Pagination -->
        <UiFlex justify="end" class="mt-2" >
          <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
        </UiFlex>
      </div>

      <UModal v-model="modal.buy" prevent-close>
        <DataGameToolRechargeBuy :recharge="rechargeSelect" :game="game" @close="modal.buy = false" @done="modal.buy = false" />
      </UModal>
    </div>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['close'])
const list = ref([])
const loading = ref(true)
const modal = ref({
  buy: false
})
const page = ref({
  size: 6,
  current: 1,
  sort: {
    column: 'recharge_id',
    direction: 'asc'
  },
  search: null,
  total: 0,
  game: props.game?.code
})
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const rechargeSelect = ref(undefined)

const startBuy = (recharge) => {
  rechargeSelect.value = recharge
  modal.value.buy = true
}

const getList = async () => {
	try {
    if(!!props.game?.paygame) throw true
    loading.value = true
    const data = await useAPI('game/tool/public/recharge/list', JSON.parse(JSON.stringify(page.value)))

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