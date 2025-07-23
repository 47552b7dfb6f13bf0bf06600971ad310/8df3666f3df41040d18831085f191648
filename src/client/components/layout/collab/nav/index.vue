<template>
  <div class="w-full py-4 px-6">
    <UiFlex type="col" v-for="(item, index) in menu" :key="`m-${index}`">
      <UiFlex 
        v-if="!item.child" 
        class="MenuItem gap-4 text-gray-500 rounded-2xl" 
        @click="goTo(item)"
        :class="{
          'MenuItem--Active': item.to == activeTo
        }"
      >
        <UiIcon class="MenuItem__Icon" :name="item.icon" size="6" v-if="!!item.icon" />
        <UiText class="MenuItem__Text" size="sm" weight="semibold">{{ item.title }}</UiText>
      </UiFlex>

      <div class="w-full my-2" v-else>
        <UiText size="xs" weight="bold" class="mb-4">{{ item.title }}</UiText>
        <UiFlex 
          v-for="(child, cIndex) in item.child" :key="`c-${index}-${cIndex}`" 
          class="MenuItem gap-4 text-gray-500 rounded-2xl" 
          @click="goTo(child)"
          :class="{
            'MenuItem--Active': child.to == activeTo
          }"
        >
          <UiIcon class="MenuItem__Icon" :name="child.icon" size="6" v-if="!!child.icon" />
          <UiText class="MenuItem__Text" size="sm" weight="semibold">{{ child.title }}</UiText>
        </UiFlex>
      </div>
    </UiFlex>
  </div>
</template>

<script setup>
const route = useRoute()
const emit = defineEmits(['to'])
const menu = ref([
  { title: 'Cài đặt', child: [
    { title: 'Thông tin trang', to: `/manage/@collab/${route.params._code}/config/info` },
    { title: 'Kênh thanh toán', to: `/manage/@collab/${route.params._code}/config/gate` },
  ]},
  { title: 'Quản lý', child: [
    { title: 'Thông kê', to: `/manage/@collab/${route.params._code}` },
    { title: 'Tin tức', to: `/manage/@collab/${route.params._code}/news` },
    { title: 'Tài khoản', to: `/manage/@collab/${route.params._code}/user` },
    { title: 'Nạp tiền', to: `/manage/@collab/${route.params._code}/payment` },
  ]},
  { title: 'Cộng tác viên (Nhánh)', child: [
    { title: 'Danh sách', to: `/manage/@collab/${route.params._code}/child` },
    { title: 'Lệnh rút tiền', to: `/manage/@collab/${route.params._code}/child/withdraw` },
  ]},
  { title: 'Thu nhập', child: [
    { title: 'Từ trò chơi', to: `/manage/@collab/${route.params._code}/income/game` },
    { title: 'Nâng VIP', to: `/manage/@collab/${route.params._code}/income/vip` }
  ]},
  { title: 'Nhiệm vụ', child: [
    { title: 'Đang sử dụng', to: `/manage/@collab/${route.params._code}/mission` },
    { title: 'Danh sách', to: `/manage/@collab/${route.params._code}/mission/list` },
  ]},
  { title: 'Trò chơi', child: [
    { title: 'Đang sử dụng', to: `/manage/@collab/${route.params._code}/game` },
    { title: 'Game Private', to: `/manage/@collab/${route.params._code}/game/private` },
    { title: 'Game Tool', to: `/manage/@collab/${route.params._code}/game/tool` },
    // { title: 'Game China', to: `/manage/@collab/${route.params._code}/game/china` }
  ]}
])

const activeTo = computed(() => {
  return route.path
})

const goTo = (item) => {
  if(!!item.disabled) return
  if(item.to == activeTo.value) return
  navigateTo(item.to)
  emit('to')
}
</script>