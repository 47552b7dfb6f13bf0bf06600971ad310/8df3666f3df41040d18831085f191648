<template>
  <UiFlex type="col" justify="center" class="inline-flex bg-gray rounded-2xl cursor-pointer overflow-hidden pb-3" @click="modal = true">
    <UiImg :src="`/character/${type}/${data[type].res}/item.png`" w="1" h="1" img-size="100px" class="z-[1]" />

    <UButton size="2xs" icon="i-game-icons-two-coins" :color="source.price == 0 ? 'rose' : 'gray'" class="px-4 max-w-full">
      {{ source.price > 0 ? useMoney().miniMoney(source.price) : 'Free' }}
    </UButton>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
      <UiContent :title="`Mua ${textFormat[type]}`" sub="Thông tin đơn hàng" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="!!loading" @click="modal = false"></UButton>
        </template>

        <DataEquipInfo :source="source" :type="type">
          <UiFlex justify="between" class="w-full gap-2">
            <UiText weight="semibold" color="gray" size="xs">Giá bán</UiText>
            <UiText weight="semibold" size="xs" :color="source.price == 0 ? 'rose' : 'primary'">{{ source.price > 0 ? useMoney().toMoney(source.price) : 'Free' }}</UiText>
          </UiFlex>
        </DataEquipInfo>

        <UiFlex justify="end" class="gap-0.5 mt-4">
          <UButton color="yellow" :loading="loading" @click="buy" size="xs">Mua Ngay</UButton>
          <UButton color="gray" :disabled="!!loading" @click="modal = false" size="xs">Đóng</UButton>
        </UiFlex>
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

const buy = async () => {
  try {
    loading.value = true
    await useAPI('equip/public/shop/buy', { _id: props.source._id })

    loading.value = false
    modal.value = false
    await nextTick()
    emits('done')
  }
  catch(e){
    loading.value = false
  }
}
</script>