<template>
  <div class="w-full py-4 px-6">
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
</template>

<script setup>
const route = useRoute()
const emit = defineEmits(['to'])
const menu = ref([
  { title: 'Quản lý', child: [
    { title: 'Người chơi', icon: 'i-bx-group', to: `/manage/@gm/private/${route.params._id}` },
    { title: 'Nhân vật', icon: 'i-bxs-user-account', to: `/manage/@gm/private/${route.params._id}/game/roles` },
    { title: 'Nhật ký', icon: 'i-bxs-book-open', to: `/manage/@gm/private/${route.params._id}/log` }
  ]},
  { title: 'Vật phẩm', child: [
    { title: 'Danh sách', icon: 'i-bx-pyramid', to: `/manage/@gm/private/${route.params._id}/item` },
    { title: 'Gói vật phẩm', icon: 'i-bx-package', to: `/manage/@gm/private/${route.params._id}/item/box` },
  ]},
  { title: 'Cửa hàng', child: [
    { title: 'Gói nạp', icon: 'i-bx-cylinder', to: `/manage/@gm/private/${route.params._id}/recharge` },
    { title: 'Vật phẩm', icon: 'i-bx-shopping-bag', to: `/manage/@gm/private/${route.params._id}/shop/item` },
    { title: 'Gói vật phẩm', icon: 'i-bx-package', to: `/manage/@gm/private/${route.params._id}/shop/pack` },
  ]},
  { title: 'Giftcode', child: [
    { title: 'Danh sách', icon: 'i-bx-barcode', to: `/manage/@gm/private/${route.params._id}/giftcode`},
    { title: 'Lịch sử', icon: 'i-bx-time', to: `/manage/@gm/private/${route.params._id}/giftcode/history`},
  ]},
  { title: 'Sự kiện', child: [
    { title: 'Danh sách', icon: 'i-bx-calendar', to: `/manage/@gm/private/${route.params._id}/event` },
    { title: 'Lịch sử', icon: 'i-bx-time', to: `/manage/@gm/private/${route.params._id}/event/history` },
  ]},
  { title: 'Vòng quay', child: [
    { title: 'Danh sách', icon: 'i-mynaui-wheel', to: `/manage/@gm/private/${route.params._id}/wheel` },
    { title: 'Lịch sử', icon: 'i-bx-time', to: `/manage/@gm/private/${route.params._id}/wheel/history` },
  ]},
  { title: 'Đập trứng', child: [
    { title: 'Cấu hình', icon: 'i-mdi-egg-easter', to: `/manage/@gm/private/${route.params._id}/egg` },
    { title: 'Lịch sử', icon: 'i-bx-time', to: `/manage/@gm/private/${route.params._id}/egg/history` },
  ]}
])

const activeTo = computed(() => {
  return route.path
})

const goTo = (link) => {
  if(link == activeTo.value) return
  navigateTo(link)
  emit('to')
}
</script>