<template>
  <UCard :ui="{ body: { padding: 'p-4 sm:p-4' }}">
    <UiContent title="Bình Luận" sub="Các bình luận về trò chơi" icon="i-fluent-comment-text-24-filled" class="GameComment">
      <div class="my-6">
        <DataEmpty text="Chưa có bình luận mới" :loading="loading.list" v-if="!!loading.list || list.length == 0" />

        <UiFlex type="col" class="gap-4" v-else>
          <UiFlex v-for="(item, index) in list" :key="index" items="start" class="w-full gap-1.5">
            <DataUserAvatar :user="item.user.user" size="md" />

            <div class="grow">
              <DataUserName :user="item.user.user" size="xs" class="mb-1" />

              <div class="p-2 px-3 rounded-r-2xl rounded-bl-2xl text-left" style="background-color: rgb(0, 0, 0, 0.12);">
                <UiText class="mb-1" :style="{ wordBreak: 'break-word' }">{{ item.content }}</UiText>
                <UiText color="gray"  class="leading-none text-[0.7rem]" mini>{{ useDayJs().fromTime(item.createdAt, null, true) }}</UiText>
              </div>
            </div>
          </UiFlex>
        </UiFlex>

        <!-- <UiFlex justify="center" class="mt-4" v-if="page.total > page.size">
          <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="2xs" />
        </UiFlex> -->
      </div>
       
      <UForm :state="state" @submit="submit">
        <UiFlex class="relative">
          <UInput 
            v-model="state.content" 
            :disabled="!!loading.create || !authStore.isLogin"
            :loading="!!loading.create" 
            :ui="{ 
              padding: { md: 'pr-10' },
              color: { gray: { outline: 'ring-0 focus:ring-0 bg-gray' }} 
            }"
            color="gray"
            variant="outline"
            :placeholder="!!authStore.isLogin ? 'Để lại bình luận của bạn...' : 'Vui lòng đăng nhập trước'" 
            class="w-full" 
            size="lg"
            ref="input"
          >
          </UInput>

          <UiIcon 
            name="i-basil-send-solid" 
            color="primary" 
            class="cursor-pointer absolute right-4" 
            size="6" 
            :disabled="!!loading.create || !authStore.isLogin" 
            @click="submit"
          ></UiIcon>
        </UiFlex>
      </UForm>
    </UiContent>
  </UCard>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game', 'os'])
const list = ref([])
const loading = ref({
  list: true,
  create: false
})
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  total: 0,
  game: props.game?.code
})
watch(() => page.value.current, () => getList())

const state = ref({
  content: null,
  game: props.game?.code
})

const submit = async () => {
  try {
    if(state.value.content.length < 5) return useNotify().error('Bình luận ít nhất 5 ký tự')
    if(state.value.content.length > 50) return useNotify().error('Bình luận nhiều nhất 50 ký tự')

    loading.value.create = true
    const data = await useAPI(`game/${props.os}/public/comment/create`, JSON.parse(JSON.stringify(state.value)))

    page.value.total = data.total
    loading.value.create = false

    state.value.content = null
    page.value.current = 1

    getList()
  }
  catch (e) {
    loading.value.create = false
  } 
}

const getList = async () => {
  try {
    loading.value.list = true
    const data = await useAPI(`game/${props.os}/public/comment/list`, JSON.parse(JSON.stringify(page.value)))

    list.value = data.list
    page.value.total = data.total
    loading.value.list = false
  }
  catch (e) {
    loading.value.list = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>

<style lang="sass">
.GameComment
  .UiContentHeader
    margin-bottom: 0 !important
</style>