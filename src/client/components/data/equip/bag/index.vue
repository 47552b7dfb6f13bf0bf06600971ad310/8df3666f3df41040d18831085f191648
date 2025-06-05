<template>
  <DataEmpty :loading="loading" text="Rương đồ chưa có trang bị" class="min-h-[250px]" v-if="!!loading || list.length == 0" />
  <UiFlex wrap justify="center" class="gap-0.5" v-else>
    <DataEquipBagItem v-for="item in list" :key="item._id" :source="item" :type="type" @done="use" />
  </UiFlex>
</template>

<script setup>
const props = defineProps(['type'])
const emits = defineEmits(['use'])
const loading = ref(true)
const list = ref([])

const use = (data) => {
  emits('use', data)
}

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('equip/public/bag/list', { type: props.type })
    list.value = data

    setTimeout(() => loading.value = false, 500)
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>