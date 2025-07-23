<template>
  <div class="w-full">
    <LoadingLayoutPublicMenu v-if="!!loading" />
    
    <div v-else class="py-4 px-6">
      <UiFlex type="col" v-for="(item, index) in menu" :key="`m-${index}`">
        <UiFlex 
          v-if="!item.child" 
          class="MenuItem gap-4 text-gray-500 rounded-2xl" 
          @click="goTo(item.to)"
          :class="{
            'MenuItem--Active': item.to == activeTo
          }"
        >
          <UiIcon class="MenuItem__Icon" :name="item.icon" size="6" />
          <UiText class="MenuItem__Text" size="sm" weight="semibold">{{ item.title }}</UiText>
        </UiFlex>

        <div class="w-full my-2" v-else>
          <UiText size="xs" weight="bold" class="mb-4">{{ item.title }}</UiText>
          <UiFlex 
            v-for="(child, cIndex) in item.child" :key="`c-${index}-${cIndex}`" 
            class="MenuItem gap-4 text-gray-500 rounded-2xl" 
            @click="goTo(child.to)"
            :class="{
              'MenuItem--Active': child.to == activeTo
            }"
          >
            <UiIcon class="MenuItem__Icon" :name="child.icon" size="6" />
            <UiText class="MenuItem__Text" size="sm" weight="semibold">{{ child.title }}</UiText>
          </UiFlex>
        </div>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const emit = defineEmits(['to'])
const menu = ref([])
const loading = ref(true)

const activeTo = computed(() => {
  return route.path
})

const goTo = (link) => {
  if(link == activeTo.value) return
  navigateTo(link)
  emit('to')
}

const makeMenu = async () => {
  try {
    loading.value = true
    const categories = await useAPI('game/public/category/select')
    const platforms = await useAPI('game/public/platform/select')
    const list =  [
      { title: 'Chức Năng', child: [
        { title: 'Nạp Xu', icon: 'i-bxs-credit-card', to: '/payment' },
        { title: 'Nâng VIP', icon: 'i-bxs-star', to: '/vip' },
        { title: 'Kiếm Tiền', icon: 'i-tdesign-money', to: '/money' },
        // { title: 'ECoin', icon: 'i-bxl-bitcoin', to: '/ecoin' },
      ]},
      { title: 'Cộng Đồng', child: [
        { title: 'Tin Tức', icon: 'i-bx-news', to: '/news' },
        { title: 'Diễn Đàn', icon: 'i-bx-layer', to: '/forum' },
      ]},
      { title: 'Danh Mục', child: [
        { title: 'Game Private', icon: 'i-fluent-games-28-filled', to: '/game/private' },
        { title: 'Game Tool', icon: 'i-ion-game-controller', to: '/game/tool' },
        // { title: 'Game China', icon: 'i-jam-gamepad-f', to: '/game/china' },
      ]},
      { title: 'Nền Tảng', child: platforms.map(i => {
        return { title: i.name, icon: i.icon, to: `/game/platform/${i.key}` }
      })},
      { title: 'Thể Loại', child: categories.map(i => {
        return { title: i.name, icon: i.icon, to: `/game/category/${i.key}` }
      })}
    ]
    menu.value = list
    loading.value = false
  }
  catch(e){
    return false
  }
}

onMounted(() => {
  setTimeout(() => makeMenu(), 1)
})
</script>