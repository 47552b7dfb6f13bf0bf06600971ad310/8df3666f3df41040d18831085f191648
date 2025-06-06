<template>
  <UiFlex justify="center" class="inline-flex bg-gray rounded-2xl cursor-pointer overflow-hidden" @click="modal = true">
    <UiImg :src="`/character/${type}/${data[type].res}/item.png`" :w="1" :h="1" img-size="100px" class="w-full overflow-hidden" />

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
      <UiContent :title="`${textFormat[type]}`" sub="Thông tin trang bị" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="!!loading" @click="modal = false"></UButton>
        </template>

        <DataEquipInfo :source="source" :type="type">
          <UiFlex justify="end" class="w-full gap-0.5">
            <UButton color="yellow" :loading="loading" @click="use" size="xs">Mặc Ngay</UButton>
            <UButton color="gray" :disabled="!!loading" @click="modal = false" size="xs">Đóng</UButton>
          </UiFlex>
        </DataEquipInfo>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['source', 'type'])
const emits = defineEmits(['done'])

const modal = ref(false)
const loading = ref(false)

const textFormat = {
  body: 'Trang Phục',
  wing: 'Cánh',
  weapon: 'Vũ Khí',
  pet: 'Thú Cưng',
  circle: 'Pháp Trận',
  title: 'Danh Hiệu',
}

const data = computed(() => {
  if(!props.source) return null
  if(!props.type) return null
  const result = {}
  result[props.type] = props.source
  return result
})

const use = async () => {
  try {
    loading.value = true
    const data = await useAPI('equip/public/bag/use', { _id: props.source._id })

    loading.value = false
    modal.value = false
    await nextTick()
    emits('done', data)
  }
  catch(e){
    loading.value = false
  }
}
</script>