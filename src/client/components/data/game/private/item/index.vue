<template>
  <div class="
    relative inline-block
    hover:ring-primary-500
    cursor-pointer
    rounded-2xl 
  ">
    <DataGamePrivateItemImage 
      class="p-1"
      :size="size"
      :src="item.item_image"
      :game="game" 
      @click="modal = true" 
    />

    <UiFlex 
      v-if="amount && amount > 0"
      class="
        absolute
        bottom-0 right-0
        rounded-2xl
        px-[7px]
        bg-gray-700
        cursor-pointer
      "
      @click="modal = true" 
    >
      <UiText align="center" weight="bold" style="color:#fff; font-size: 9px;" >
        {{ miniMoney(amount) }}
      </UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UCard class="bg-card" :ui="{ body: { padding: 'p-4 sm:p-4' } }">
        <DataGamePrivateItemImage :src="item.item_image" :size="120" class="mx-auto" :game="game" />

        <UiFlex type="col" class="mt-4">
          <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mt-2 mb-0.5 max-w-[90%]">
            {{ item.item_name }}
          </UiText>
          <UiText size="xs" weight="semibold" class="line-clamp-1 mb-4" color="gray">Vật Phẩm</UiText>
          <UButton color="gray" class="px-4 md:px-6 max-w-full">x {{ toMoney(amount) }}</UButton>
        </UiFlex>
      </UCard>
    </UModal>
  </div>
</template>

<script setup>
const { miniMoney, toMoney } = useMoney()
const props = defineProps({
  item: Object,
  amount: [ String, Number ],
  size: { type: [ String, Number ]},
  game: { type: String }
})

const modal = ref(false)
</script>