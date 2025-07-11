<template>
  <div>
    <DataEmpty :loading="loading" class="min-h-[250px]" v-if="!!loading || list.length == 0" />
    <DataGameListSlide :list="list" os="tool" v-else />
  </div>
</template>

<script setup>
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 4,
  current: 1,
  total: 0
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/tool/public/list/openserver', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    setTimeout(() => loading.value = false, 700)
  }
  catch (e) {
    loading.value = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>