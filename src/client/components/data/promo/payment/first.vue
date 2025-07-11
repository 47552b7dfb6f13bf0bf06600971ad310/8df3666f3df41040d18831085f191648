<template>
  <UiFlex class="box-purple rounded-2xl overflow-hidden gap-2 py-2 px-1 cursor-pointer" @click="navigateTo('/payment')">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/promo-first.png" w="1" h="1" img-size="200px" class="w-full" />
    </UiFlex>
    
    <div>
      <UiText class="text-xs md:text-base mb-1">Thưởng nạp đầu</UiText>
      <UiText class="text-xl md:text-3xl" weight="bold">
        <UiNumber :num="configStore.config.promo.payment.first">
          <template #default="{ display }">
            {{ display }}%
          </template>
        </UiNumber>
      </UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
</script>