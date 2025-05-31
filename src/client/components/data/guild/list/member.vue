<template>
  <UiContent title="Thành Viên" sub="Danh sách thành viên gia tộc" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading.list || !!loading.del" @click="emit('close')"></UButton>
    </template>

    <UForm :state="page" @submit="page.current = 1, getList()" class="mb-4">
      <UInput v-model="page.search" placeholder="Tìm kiếm thành viên..." icon="i-bx-search" size="md" :disabled="!!loading.list || !!loading.del" />
    </UForm>

    <DataEmpty class="min-h-[300px]" :loading="loading.list" text="Hiện tại chưa có thành viên nào" v-if="!!loading.list || list.length == 0" />
    <UiFlex class="overflow-y-auto gap-6 max-h-[60vh] min-h-[60vh]" type="col" v-else>
      <UiFlex v-for="item in list" :key="item._id" class="w-full space-x-2">
        <DataUserAvatar :user="item.user" size="md"/>
        
        <div class="grow">
          <DataUserName :user="item.user" class="mb-1.5" size="sm" no-guild />

          <UBadge :color="item.type == 100 ? 'rose' : 'gray'" variant="soft">
            {{ item.type == 100 ? 'Bang chủ' : 'Bang chúng' }}
          </UBadge>

          <UBadge color="green" class="ml-1" variant="soft">
            <UiText weight="semibold">{{ useMoney().toMoney(item.donate) }}</UiText>
            <UiIcon name="i-bx-donate-blood"></UiIcon>
          </UBadge>
        </div>

        <UButton 
          icon="i-bx-trash" 
          color="gray" 
          class="ml-auto"
          @click="del(item.user._id)"
          v-if="authStore.profile._id == props.guild.master && item.type != 100"
        ></UButton>
      </UiFlex>
    </UiFlex>

    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="xs" :disabled="!!loading.list || !!loading.del"/>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['guild'])
const emit = defineEmits(['close'])

const list = ref([])
const loading = ref({
  list: true,
  del: false
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

const del = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('guild/public/action/member/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  } 
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('guild/public/list/member', JSON.parse(JSON.stringify(page.value)))

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