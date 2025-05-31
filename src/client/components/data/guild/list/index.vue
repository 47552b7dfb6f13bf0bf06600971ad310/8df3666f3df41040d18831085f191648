<template>
  <UiFlex class="w-full grow overflow-hidden" type="col">
    <UiFlex class="w-full p-2 gap-2">
      <UForm :state="page" @submit="page.current = 1, getList()" class="grow">
        <UInput v-model="page.search" placeholder="Tìm kiếm gia tộc..." icon="i-bx-search" size="md" :disabled="!!loading" />
      </UForm>

      <DataGuildActionCreate v-if="!!authStore.isLogin && !authStore.profile.guild" />
    </UiFlex>

    <DataEmpty class="w-full grow" :loading="loading" text="Hiện tại chưa có gia tộc nào" v-if="!!loading || list.length == 0" />
    <UiFlex class="w-full grow overflow-y-auto gap-1" type="col" v-else>
      <DataGuildInfoMini v-for="item in list" :key="item._id" :guild="item" action-join>
        <UiText size="xs" color="gray">Cấp {{ item.request.level }} có thể tham gia</UiText>
      </DataGuildInfoMini>
    </UiFlex>

    <UiFlex justify="center" class="p-2">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading"/>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()
const list = ref([])
const loading = ref(true)
const page = ref({
  size: 10,
  current: 1,
  search: null,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.search, (val) => !val && getList())

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('guild/public/list/main', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value = false, 500)
  }
  catch (e) {
    return false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>