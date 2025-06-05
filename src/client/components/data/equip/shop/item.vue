<template>
  <UiFlex class="inline-flex">
    <UiFlex justify="center" class="bg-gray border-1 border-gray rounded-2xl w-[50px] h-[50px] px-1 cursor-pointer" @click="modal = true">
      <UiText class="text-[10px]" align="center" color="gray">{{ textFormat[type] }}</UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
      <UiContent :title="textFormat[type]" class="bg-card rounded-2xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="!!loading" @click="modal = false"></UButton>
        </template>

        <DataEquipInfo :source="source" :type="type" />

        <UButton color="yellow" icon="i-bx-cart" block class="mt-4" :loading="loading" @click="buy">{{ useMoney().toMoney(source.price) }} Xu</UButton>
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