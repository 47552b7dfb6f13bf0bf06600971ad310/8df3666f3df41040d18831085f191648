<template>
  <DataEmpty :loading="loading.category" class="min-h-[300px]" v-if="!!loading.category || !category"/>

  <div v-else>
    <UiMinibanner      
      :title="subcategory ? subcategory.name : category.name" 
      :sub="subcategory ? subcategory.description : category.description"
      type="forum" 
      class="mb-4" 
    />

    <!-- Breadcrumb -->
    <UBreadcrumb :links="breadcrumb" class="mb-4"/>

    <!-- Sub Category -->
    <UCard :ui="{ body: { padding: 'py-0 sm:py-0' }}" v-if="!!subs && subs.length > 0" class="mb-4">
      <div class="divide-y divide-gray-900" >
        <UiFlex v-for="(item, i) in subs" :key="i" class="py-4 gap-4">
          <UButton square icon="i-bx-folder" color="gray"></UButton>

          <div class="grow">
            <NuxtLink :to="`/forum/category/${category.key}?sub=${item.key}`">
              <UiText color="primary" weight="bold" class="md:text-base text-sm select-none">{{ item.name }}</UiText>
            </NuxtLink>
            
            <UiText color="gray" class="md:text-sm text-xs select-none">{{ item.description }}</UiText>
          </div>

          <UiFlex class="divide-x divide-gray-900 hidden md:flex select-none">
            <UiFlex type="col" class="px-2">
              <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.posts) }}</UiText>
              <UiText size="xs" color="gray">Chủ đề</UiText>
            </UiFlex>

            <UiFlex type="col" class="px-2">
              <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.views) }}</UiText>
              <UiText size="xs" color="gray">Lượt xem</UiText>
            </UiFlex>

            <UiFlex type="col" class="px-2">
              <UiText size="sm" weight="semibold">{{ useMoney().miniMoney(item.comments) }}</UiText>
              <UiText size="xs" color="gray">Bình luận</UiText>
            </UiFlex>
          </UiFlex>
        </UiFlex>
      </div>
    </UCard>

    <!--Post-->
    <UCard :ui="{ body: { padding: '!pb-0' }}">
      <UiFlex class="mb-4 gap-1">
        <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" size="lg" />
        
        <UForm :state="page" @submit="page.current = 1, getPosts()">
          <UInput v-model="page.search" placeholder="Tìm kiếm..." icon="i-bx-search" size="lg" />
        </UForm>

        <UButton class="color-blue-light bg-anim-light ml-auto" icon="i-bx-edit" size="md" @click="openCreate">Viết Bài </UButton>
      </UiFlex>

      <div>
        <DataEmpty class="min-h-[300px]" text="Hiện tại chưa có chủ để" :loading="loading.post" v-if="!!loading.post || posts.length == 0" />
        <DataForumPostList :list="posts" v-else></DataForumPostList>
      </div>

      <UiFlex justify="end" class="mt-4" v-if="page.total > page.size">
        <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" size="md" />
      </UiFlex>
    </UCard>

    <!--Create-->
    <UModal v-model="modal.create" prevent-close :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent title="Tạo Chủ Đề" no-dot class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" :disabled="loading.create" square @click="modal.create = false"></UButton>
        </template>

        <UForm ref="form" :state="state" :validate="validate" @submit="create">
          <UFormGroup label="Danh mục" name="category" v-if="!!category">
            <UInput :model-value="category.name" readonly />
          </UFormGroup>

          <UFormGroup label="Danh mục con" name="sub" v-if="!!subcategory">
            <UInput :model-value="subcategory.name" readonly />
          </UFormGroup>

          <UFormGroup label="Tiêu đề" name="title">
            <UInput v-model="state.title" />
          </UFormGroup>

          <UFormGroup label="Nội dung" name="content">
            <UiEditor v-model="state.content" class="bg-gray"></UiEditor>
          </UFormGroup>

          <UiFlex justify="end" class="gap-1 mt-4">
            <UButton type="submit" :loading="loading.create" color="yellow" size="md">Xác Nhận</UButton>
            <UButton color="gray" @click="modal.create = false" :disabled="loading.create" size="md">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
const route = useRoute()
const category = ref(undefined)
const subcategory = ref(undefined)

const titleMeta = computed(() => {
  if(!category.value && !subcategory.value) return '...'
  if(!!category.value && !subcategory.value) return category.value.name
  if(!!category.value && !!subcategory.value) return `${subcategory.value.name} - ${category.value.name}`
  return '...'
})

const descriptionMeta = computed(() => {
  if(!category.value && !subcategory.value) return '...'
  if(!!category.value && !subcategory.value) return category.value.description
  if(!!category.value && !!subcategory.value) return subcategory.value.description
  return '...'
})

useSeoMeta({
  title: () => `${titleMeta.value} - Diễn Đàn - ${configStore.config.name}`,
  ogTitle: () => `${titleMeta.value} - Diễn Đàn - ${configStore.config.name}`,
  description: () => descriptionMeta,
  ogDescription: () => descriptionMeta
})


const subs = ref(undefined)
const posts = ref([])

const form = ref()
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'update.last',
    direction: 'desc'
  },
  total: 0,
  search: null,
  category: null,
  sub: null
})
watch(() => page.value.size, () => getPosts())
watch(() => page.value.current, () => getPosts())
watch(() => page.value.sort.column, () => getPosts())
watch(() => page.value.sort.direction, () => getPosts())
watch(() => page.value.search, (val) => !val && getPosts())

const loading = ref({
  category: true,
  post: true,
  create: false
})

const modal = ref({
  create: false
})

const breadcrumb = computed(() => {
  const list = [{
    label: 'Diễn đàn', to: '/forum'
  }]
  if(category.value) list.push({ label: category.value.name, to: `/forum/category/${category.value.key}`})
  if(subcategory.value) list.push({ label: subcategory.value.name, to: `/forum/category/${category.value.key}?sub=${subcategory.key}`})
  return list
})

// State Create
const state = ref({
  title: null,
  content: null,
  category: null,
  sub: null
})
const validate = (state) => {
  const errors = []
  if (!state.title) errors.push({ path: 'title', message: 'Vui lòng nhập tiêu đề bài viết' })
  if (!state.content) errors.push({ path: 'content', message: 'Vui lòng nhập nội dung bài viết' })
  if (!state.category) errors.push({ path: 'category', message: 'Vui lòng chọn nền tảng' })
  return errors
}
const openCreate = () => {
  state.value.category = category.value._id
  state.value.sub = subcategory.value ? subcategory.value._id : null
  modal.value.create = true
}

const getPosts = async () => {
  try {
    loading.value.post = true
    const data = await useAPI('forum/public/post/list', JSON.parse(JSON.stringify(page.value)))

    posts.value = data.list
    page.value.total = data.total

    setTimeout(() => loading.value.post = false, 500)
  }
  catch(e){
    loading.value.post = false
  }
}

const getCategory = async () => {
  try {
    loading.value.category = true
    const data = await useAPI('forum/public/category/key', {
      key: route.params._key,
      sub: route.query.sub
    })
    
    category.value = data.category
    subcategory.value = data.subcategory
    subs.value = data.subs

    page.value.category = category.value ? category.value._id : null
    page.value.sub = subcategory.value ? subcategory.value._id : null

    await getPosts()
    loading.value.category = false
  }
  catch(e){
    loading.value.category = false
  }
}

const create = async () => {
  try {
    loading.value.create = true
    await useAPI('forum/public/post/create', JSON.parse(JSON.stringify(state.value)))

    loading.value.create = false
    modal.value.create = false
    await getPosts()
  }
  catch(e){
    loading.value.create = false
  }
}

getCategory()
watch(() => route.query, () => getCategory())
</script>