<template>
  <UiFlex class="box-red rounded-2xl overflow-hidden gap-2 py-2 px-1 cursor-pointer" @click="action">
    <UiFlex class="inline-flex h-[90%] w-[20%] md:w-[30%] ml-2">
      <UiImg src="/images/icon/promo-reg.png" w="1" h="1" img-w="200" img-h="200" img-size="200px" class="w-full" />
    </UiFlex>

    <div>
      <UiText class="text-xs md:text-base mb-1">Đăng ký tặng xu</UiText>
      <UiText class="text-xl md:text-3xl" weight="bold">{{ useMoney().toMoney(configStore.config.promo.register.coin) }}</UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const authStore = useAuthStore()

const action = () => {
  if(!!authStore.isLogin) return useNotify().error('Bạn đã đăng nhập tài khoản')
  authStore.setModal(true)
}
</script>