<template>
  <UiContent no-dot title="Nạp Game" sub="Mua gói nạp vào trong game" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" square :disabled="loading" color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
    </template>

    <UForm :state="state" :validate="validate" @submit="buy">
      <UFormGroup label="Số dư Xu" name="coin">
        <UInput :model-value="`${toMoney(authStore.profile.currency.coin)}`" readonly/>

        <template #hint>
          <DataPaymentFast />
        </template>
      </UFormGroup>

      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Voucher">
        <SelectVoucher v-model="state.voucher" v-model:voucherData="voucher" type="DISCOUNT" />
      </UFormGroup>

      <UFormGroup label="Thông tin đơn hàng" name="info">
        <UCard class="bg-gray" :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6"> Mặt hàng</UiText>
            <UiText align="right">{{ recharge.recharge_name }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">Đơn giá</UiText>
            <UiText align="right">{{ toMoney(recharge.price) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="useRate().data(game.rate.shop).number > 0">
            <UiText color="gray" class="mr-6">Giảm giá Game</UiText>
            <UiText align="right" color="rose">- {{ useRate().data(game.rate.shop).number }}%</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="discountVip > 0">
            <UiText color="gray" class="mr-6">Giảm giá VIP</UiText>
            <UiText align="right" color="rose">- {{ discountVip }}%</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="discountVoucher > 0">
            <UiText color="gray" class="mr-6">Giảm giá Voucher</UiText>
            <UiText align="right" color="rose">- {{ discountVoucher }}%</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="totalPrice != null">
            <UiText color="gray" class="mr-6">Thành tiền</UiText>
            <UiText color="primary" weight="bold" align="right">{{ toMoney(totalPrice) }} Xu</UiText>
          </UiFlex>
        </UCard>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton type="submit" size="md" :loading="loading" color="yellow">Mua Ngay</UButton>
        <UButton color="gray" size="md" :disabled="loading" @click="emits('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const { toMoney } = useMoney()
const props = defineProps(['game', 'recharge', 'server', 'role'])
const emits = defineEmits(['done', 'close'])
const loading = ref(false)

const state = ref({
  recharge: props.recharge?._id, 
  server: props.server,
  role: props.role,
  game: props.game?.code,
  voucher: null
})

const voucher = ref()

const validate = (state) => {
  const errors = []
  if (totalPrice.value == null) errors.push({ path: 'info', message: 'Không thể lấy thông tin giá tiền' })
  else if (totalPrice.value != null && authStore.profile.currency.coin < totalPrice.value && !authStore.isAdmin) errors.push({ path: 'coin', message: 'Số dư Xu không đủ' })
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const totalPrice = computed(() => {
  const amount = 1
  const price = props.recharge.price
  const discount_system = useRate().data(props.game.rate.shop).number
  const discount_vip = discountVip.value
  const discount_voucher = discountVoucher.value

  if(!amount || amount < 1) return null
  if(!price || price < 1) return null

  let discount = discount_system + discount_vip + discount_voucher
  discount = discount > 100 ? 100 : discount

  let total = Math.floor(amount * price)
  total = total - Math.floor(total * discount / 100)
  return total
})

const discountVip = computed(() => {
  if(!authStore.vip) return 0
  if(!props.game.rate.shop.vip) return 0
  return Number(props.game.rate.shop.vip[authStore.vip])
})

const discountVoucher = computed(() => {
  if(!voucher.value) return 0
  if(!voucher.value.value) return 0
  return Number(voucher.value.value)
})

const buy = async () => {
  try {
    loading.value = true
    await useAPI('game/private/public/project/shop/recharge/buy', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('done', {
      type: 'recharge-done',
      source: props.recharge,
      recharge_id: props.recharge.recharge_id,
      server: props.server,
      role: props.role,
    })
	}
	catch(e){
    loading.value = false
  }
}
</script>