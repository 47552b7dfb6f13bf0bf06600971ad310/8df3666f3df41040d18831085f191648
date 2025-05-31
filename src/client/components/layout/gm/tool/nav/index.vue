<template>
  <div class="w-full p-4">
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
  { title: 'Người chơi', icon: 'i-bx-group', to: `/manage/@gm/tool/${route.params._id}`},
  { title: 'Nhân vật', icon: 'i-bxs-user-account', to: `/manage/@gm/tool/${route.params._id}/roles`},
  { title: 'Gói nạp', icon: 'i-bx-cylinder',  to: `/manage/@gm/tool/${route.params._id}/recharge`},
  { title: 'Vật phẩm', icon: 'i-bx-pyramid', to: `/manage/@gm/tool/${route.params._id}/item`},
  { title: 'Nhật ký', icon: 'i-bxs-book-open', to: `/manage/@gm/tool/${route.params._id}/log`}
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