<template>
  <UiContent title="Lịch Sử" sub="Lịch sử cống hiến của thành viên" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading.list" @click="emit('close')"></UButton>
    </template>

    <UForm :state="page" @submit="page.current = 1, getList()" class="mb-4">
      <UInput v-model="page.search" placeholder="Tìm kiếm thành viên..." icon="i-bx-search" size="md" :disabled="!!loading.list" />
    </UForm>

    <DataEmpty class="min-h-[300px]" :loading="loading.list" text="Hiện tại chưa có thành viên nào" v-if="!!loading.list || list.length == 0" />
    <UiFlex class="overflow-y-auto gap-6 max-h-[60vh] min-h-[60vh]" type="col" v-else>
      <UiFlex v-for="item in list" :key="item._id" class="w-full space-x-2">
        <DataUserAvatar :user="item.user" size="md"/>
        
        <div class="grow">
          <DataUserName :user="item.user" class="mb-1.5" size="sm" no-guild />
          <UBadge color="green" class="ml-1" variant="soft">
            <UiText weight="semibold">{{ useMoney().toMoney(item.coin) }}</UiText>
            <UiIcon name="i-bx-donate-blood"></UiIcon>
          </UBadge>
          <UBadge color="gray" class="ml-1" variant="soft">
            <UiText weight="semibold">{{ useDayJs().fromTime(item.createdAt) }}</UiText>
            <UiIcon name="i-bx-time"></UiIcon>
          </UBadge>
        </div>
      </UiFlex>
    </UiFlex>

    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading.list"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['guild'])
const emit = defineEmits(['close'])

const list = ref([])
const loading = ref({
  list: true
})
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
    loading.value.list = true
    const data = await useAPI('guild/public/list/donate', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.list = false, 500)
  }
  catch (e) {
    loading.value.list = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>