<template>
  <UButton class="color-blue-light bg-anim-light relative pr-10" :size="size" >
    <span class="text-white" v-if="authStore.profile.currency.coin == 0">Nạp Ngay</span>
    <span class="text-white" v-else>{{ authStore.profile.currency.coin > 99999999 ? miniMoney(authStore.profile.currency.coin) : toMoney(authStore.profile.currency.coin) }}</span> 
    <UiIcon name="i-game-icons-two-coins" size="6" class="absolute right-2"/>
  </UButton>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()
const props = defineProps({
  size: {
    type: String,
    default: 'lg'
  }
})
const authStore = useAuthStore()
</script>