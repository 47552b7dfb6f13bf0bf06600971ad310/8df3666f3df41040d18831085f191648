<template>
  <DataEmpty :loading="loading.page" class="min-h-[300px]" v-if="!!loading.page || !post"/>

  <div class="md:max-w-[900px] mx-auto" v-else>
    <UiMinibanner :title="post.title" class="mb-4">
      <template #sub>
        <!--Breadcrumb-->
        <UBreadcrumb :links="breadcrumb" />
      </template>

      <UiFlex class="gap-6 mt-4 w-full justify-center md:justify-start">
        <UiFlex type="col" class="grow md:grow-0">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(post.statistic.view) }}</UiText>
          <UiText color="gray" size="xs">Lượt xem</UiText>
        </UiFlex>

        <UiFlex type="col" class="grow md:grow-0">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(post.statistic.like) }}</UiText>
          <UiText color="gray" size="xs">Lượt thích</UiText>
        </UiFlex>

        <UiFlex type="col" class="grow md:grow-0">
          <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(post.statistic.comment) }}</UiText>
          <UiText color="gray" size="xs">Bình luận</UiText>
        </UiFlex>

        <UiFlex class="gap-1 hidden md:flex ml-auto">
          <UButton 
            class="ml-auto" icon="i-bx-like" 
            size="md" 
            :color="post.liked ? 'rose' : 'gray'" 
            :loading="loading.like" 
            @click="updateLike(post.liked ? false : true)"
          >
            {{ post.liked ? 'Bỏ thích' : 'Thích' }}
          </UButton>
          
          <UButton size="md" icon="i-bx-chat" class="color-blue-light bg-anim-light" @click="modal.comment = true">Phản hồi</UButton>
        </UiFlex>
      </UiFlex>
    </UiMinibanner>

    <!--User-->
    <UiFlex class="gap-2 mb-6">
      <DataUserAvatar :user="post.creater" size="md" />

      <div class="ml-2 pt-2">
        <DataUserName :user="post.creater" class="mb-2" />
        <UiText size="xs" color="gray">Đã đăng {{ useDayJs().displayFull(post.update.last) }}</UiText>
      </div>
    </UiFlex>

    <!--Content-->
    <div class="mb-6">
      <DataEmpty class="h-[300px]" v-if="!post.content || post.content == '<p></p>'" />
      <UiEditorContent :content="post.content" v-else />
    </div>

    <!--Comment-->
    <UiContent title="Bình luận" sub="Các phản hồi về bài viết" icon="i-fluent-comment-text-24-filled" class="bg-gray-1000 rounded-2xl p-4" >
      <!--Action-->
      <UiFlex class="gap-1 mb-4">
        <USelectMenu v-model="page.size" size="md" :options="[5,10,20,50,100]" />

        <UButton 
          class="ml-auto" icon="i-bx-like" 
          size="md" 
          :color="post.liked ? 'rose' : 'gray'" 
          :loading="loading.like" 
          @click="updateLike(post.liked ? false : true)"
        >
          {{ post.liked ? 'Bỏ thích' : 'Thích' }}
        </UButton>
        
        <UButton size="md" icon="i-bx-chat" class="color-blue-light bg-anim-light" @click="modal.comment = true">Phản hồi</UButton>
      </UiFlex>

      <!--Content-->
      <div>
        <DataEmpty class="min-h-[300px]" :loading="loading.comment.list" text="Bài viết chưa có phản hồi" v-if="!!loading.comment.list || comments.length == 0"/>
        <DataForumPostCommentList :list="comments" v-else />
      </div>

      <UiFlex justify="between" class="mt-4">
        <UButton icon="i-bxs-arrow-to-top" color="gray" size="md" @click="scrollTop">Top</UButton>
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="md" />
      </UiFlex>
    </UiContent>

    <!--Create-->
    <UModal v-model="modal.comment" prevent-close :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Phản hồi bài viết" no-dot class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" :disabled="loading.comment.create" square @click="modal.comment = false"></UButton>
        </template>

        <UForm ref="form" :state="state" :validate="validate" @submit="createComment">
          <UFormGroup name="content">
            <UiEditor v-model="state.content" class="bg-gray"></UiEditor>
          </UFormGroup>

          <UiFlex justify="end" class="gap-1 mt-4">
            <UButton type="submit" :loading="loading.comment.create" color="yellow" size="md">Xác Nhận</UButton>
            <UButton color="gray" @click="modal.comment = false" :disabled="loading.comment.create" size="md">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
const post = ref(undefined)
const comments = ref([])
const loading = ref({
  page: true,
  like: false,
  comment: {
    list: true,
    create: false
  },
})
const modal = ref({
  comment: false
})
const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'asc'
  },
  total: 0,
  post: null
})
watch(() => page.value.size, () => getComments())
watch(() => page.value.current, () => getComments())

// State Create
const state = ref({
  content: null,
  post: null
})
const validate = (state) => {
  const errors = []
  if (!state.content) errors.push({ path: 'content', message: 'Vui lòng nhập nội dung bài viết' })
  return errors
}

const breadcrumb = computed(() => {
  const list = [{label: 'Diễn đàn', to: '/forum'}]
  if(post.value.category) list.push({ label: post.value.category.name, to: `/forum/category/${post.value.category.key}`})
  if(post.value.sub) list.push({ label: post.value.sub.name, to: `/forum/category/${post.value.category.key}?sub=${post.value.sub.key}`})
  // list.push({ label: post.value.title })
  return list
})

const scrollTop = () => {
  window.scrollTo(0, 0)
}

// Post
const getPost = async () => {
  try {
    loading.value.page = true
    const data = await useAPI('forum/public/post/key', {
      key: route.params._key
    })

    post.value = data
    page.value.post = data._id

    state.value.post = data._id
    state.value.content = null

    loading.value.page = false
    await getComments()
  }
  catch(e){
    loading.value.page = false
  }
}

// Comment
const getComments = async () => {
  try {
    loading.value.comment.list = true
    const data = await useAPI('forum/public/post/comment/list', JSON.parse(JSON.stringify(page.value)))

    comments.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.comment.list = false, 700)
  }
  catch(e){
    loading.value.comment.list = false
  }
}

const createComment = async () => {
  try {
    loading.value.comment.create = true
    await useAPI('forum/public/post/comment/create', JSON.parse(JSON.stringify(state.value)))

    loading.value.comment.create = false
    modal.value.comment = false

    await getComments()
  }
  catch(e){
    loading.value.comment.create = false
  }
}

// Like
const updateLike = async (type) => {
  try {
    loading.value.like = true
    const data = await useAPI(`forum/public/post/like/${!!type ? 'create' : 'undo'}`, {
      post: post.value._id
    })

    post.value.liked = data
    loading.value.like = false
  }
  catch(e){
    loading.value.like = false
  }
}

getPost()
watch(() => authStore.isLogin, () => getPost())
</script>