<template>
  <DataEmpty :loading="loading" text="Chưa có trang bị bày bán hoặc bạn đã mua hết trang bị" class="min-h-[250px]" v-if="!!loading || list.length == 0" />
  <UiFlex wrap justify="center" class="gap-0.5" v-else>
    <DataEquipShopItem v-for="item in list" :key="item._id" :source="item" :type="type" @done="getList" />
  </UiFlex>
</template>

<script setup>
const props = defineProps(['type'])
const loading = ref(true)
const list = ref([])

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('equip/public/shop/list', { type: props.type })
    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>