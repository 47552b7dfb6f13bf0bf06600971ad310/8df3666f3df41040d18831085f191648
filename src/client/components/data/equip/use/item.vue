<template>
  <UiFlex class="inline-flex">
    <UiFlex justify="center" class="bg-gray-900/50 border-1 border-gray opacity-[90%] rounded-2xl w-[50px] h-[50px] px-1 cursor-pointer" @click="modal = true">
      <UiText class="text-[10px]" align="center" color="gray">{{ textFormat[type] }}</UiText>
    </UiFlex>

    <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[400px]'}">
      <UiContent :title="textFormat[type]" class="bg-card rounded-2xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal = false"></UButton>
        </template>

        <div v-if="!!tabs">
          <UTabs v-model="tab" :items="tabs"></UTabs>
          <DataEquipInfo :source="source" :level="level" :type="type" v-if="tab == 0" />
          <DataEquipBag :type="type" v-if="tab == 1" @use="use" />
          <DataEquipShop :type="type" v-if="tab == 2" />
        </div>

        <DataEquipInfo :source="source" :level="level" :type="type"  v-else />
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()

const props = defineProps(['source', 'level', 'type', 'user'])
const emits = defineEmits(['use'])

const modal = ref(false)

const tab = ref(0)
const tabs = computed(() => {
  if(!authStore.isLogin) return null
  else {
    if(props.user == authStore.profile._id) return [
      { label: 'Thông tin' },
      { label: 'Kho đồ' },
      { label: 'Cửa hàng' },
    ]
    return null
  }
})

const textFormat = {
  body: 'Trang Phục',
  wing: 'Cánh',
  weapon: 'Vũ Khí',
  pet: 'Thú Cưng',
  circle: 'Pháp Trận',
  title: 'Danh Hiệu',
}

const use = (data) => {
  emits('use', { type: props.type, equip: data })
  modal.value = false
  setTimeout(() => tab.value = 0, 500)
}
</script>