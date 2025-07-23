<template>
  <div>
    <UiFlex class="mb-2 gap-1" justify="between">
      <UForm :state="page" @submit="page.current = 1, getList()" class="grow">
        <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="md" />
      </UForm>

      <DataPaymentFast v-if="!!authStore.isLogin" :custom="true">
        <template #default="{ toggle }">
          <DataUserCoin size="sm" @click="toggle()" />
        </template>
      </DataPaymentFast>
    </UiFlex>

    <DataEmpty :loading="loading" text="Chưa có trang bị bày bán hoặc đã mua hết trang bị" class="min-h-[250px]" v-if="!!loading || list.length == 0" />
    
    <div class="grid grid-cols-12 gap-1" v-else>
      <DataEquipShopItem class="col-span-4" v-for="item in list" :key="item._id" :source="item" :type="type" @done="emits('buy')" />
    </div>

    <UiFlex justify="end" class="mt-2">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['type'])
const emits = defineEmits(['buy'])
const loading = ref(true)

const list = ref([])

const page = ref({
  size: 9,
  current: 1,
  sort: {
    column: 'price',
    direction: 'asc'
  },
  search: null,
  total: 0,
  type: props.type
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('equip/public/shop/list', JSON.parse(JSON.stringify(page.value)))
    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 500)
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>