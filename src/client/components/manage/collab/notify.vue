<template>
  <UiContent title="Notification" sub="Thông báo nền tảng">
    <UiFlex class="mb-2">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <DataEmpty v-if="!!loading.list || list.length == 0" text="Không có thông báo" :loading="loading.list" class="min-h-[300px]" />

    <UiFlex v-else class="gap-2" type="col" >
      <UAlert 
        :title="item.title"
        :icon="!!item.pin ? 'i-bxs-pin' : 'i-bx-bell'" 
        class="bg-gray-1000" 
        v-for="(item, index) in list" :key="index" 
      >
        <template #description>
          <UiText color="primary" weight="semibold" v-html="item.content" class="mb-1"></UiText>
          <UiText color="gray" size="xs">{{ useDayJs().fromTime(item.createdAt) }}</UiText>
        </template>
      </UAlert>
    </UiFlex>

    <UiFlex justify="center" class="mt-4">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" />
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'sm:max-w-[700px]' }">
      <div class="bg-card rounded-2xl p-4">
        <DataEmpty v-if="!!loading.view || !notify" text="Không có thông tin" :loading="loading.view" class="min-h-[300px]"  />
      
        <UiContent
          v-else 
          :title="notify.title" 
          :sub="useDayJs().fromTime(notify.createdAt)"
          :icon="!!notify.pin ? 'i-bxs-pin' : 'i-bx-bell'"
          no-dot 
        >
          <template #more>
            <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
          </template>

          <DataEmpty v-if="!notify.content || notify.content == '<p></p>'" text="Không có thông tin" class="min-h-[300px]"  />
          <UiEditorContent v-else :content="notify.content" />
        </UiContent>
      </div>
    </UModal>
  </UiContent>
</template>

<script setup>
const route = useRoute()

const list = ref([])

const loading = ref({
  list: true,
  view: false
})

const modal = ref(false)

const notify = ref(null)
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  type: 'all',
  collab: route.params._code
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.type, () => getList())

const tab = ref(0)
const tabs = [
  { label: 'Tất cả', key: 'all' },
  { label: 'Thu nhập', key: 'income' },
  { label: 'Số dư TT', key: 'gatepay' },
  { label: 'Rút tiền', key: 'withdraw' },
]
watch(tab, (val) => page.value.type = tabs[val].key)

const view = async (_id) => {
  try {
    loading.value.view = true
    modal.value = true

    const data = await useAPI('collab/manage/code/notify/view', {
      _id: _id,
      collab: route.params._code
    })

    notify.value = data
    setTimeout(() => loading.value.view = false, 500)
  }
  catch(e){
    loading.value.view = false
    notify.value = null
  }
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI('collab/manage/code/notify/list', JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.list = false, 500)
  }
  catch(e){
    loading.value.list = false
  }
}

getList()
</script>