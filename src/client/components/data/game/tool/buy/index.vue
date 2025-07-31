<template>
  <UiContent no-dot title="Mua Tool" sub="Mua công cụ cho từng máy chủ riêng biệt" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading" @click="emits('close')"></UButton>
    </template>

    <UForm :state="stateBuy">
      <UFormGroup label="Số dư Xu" name="coin">
        <UInput :model-value="`${toMoney(authStore.profile.currency.coin + authStore.profile.currency.lcoin)}`" readonly/>

        <template #hint>
          <DataPaymentFast />
        </template>
      </UFormGroup>
      
      <UFormGroup label="Máy chủ">
        <SelectGameServer v-model="stateBuy.server_id" :game="game.code" type="tool" />
      </UFormGroup>

      <UFormGroup label="Voucher" v-if="!!stateBuy.server_id">
        <SelectVoucher v-model="stateBuy.voucher" v-model:voucherData="voucher" type="DISCOUNT" />
      </UFormGroup>

      <div v-if="!!checkdone.status">
        <UFormGroup label="Trạng thái tài khoản">
          <div class="pl-4">
            <UiFlex class="my-4">
              <UCheckbox v-model="stateBuy.recharge" :color="!!checkdone.recharge ? 'green' : 'primary'" :disabled="!!checkdone.recharge" label="Nạp tiền" class="mr-auto" />
              <UiText weight="semibold" size="sm" :color="!!checkdone.recharge ? 'green' : null">{{ !!checkdone.recharge ? 'Đã mua' : toMoney(game.price.recharge) }}</UiText>
            </UiFlex>

            <UiFlex class="my-4">
              <UCheckbox v-model="stateBuy.mail" :color="!!checkdone.mail ? 'green' : 'primary'" :disabled="!!checkdone.mail" label="Gửi thư" class="mr-auto" />
              <UiText weight="semibold" size="sm" :color="!!checkdone.mail ? 'green' : null">{{ !!checkdone.mail ? 'Đã mua' : toMoney(game.price.mail) }}</UiText>
            </UiFlex>
          </div>
        </UFormGroup>

        <UFormGroup label="Thông tin đơn hàng" v-if="!checkdone.recharge || !checkdone.mail">
          <div class="pl-4">
            <UiFlex class="my-3">
              <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Đơn giá</UiText>
              <UiText weight="semibold" size="sm">{{ toMoney(price) }}</UiText>
            </UiFlex>

            <UiFlex class="my-3" v-if="discount > 0">
              <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Giảm giá VIP</UiText>
              <UiText weight="semibold" size="sm" color="rose">- {{ toMoney(discount) }}%</UiText>
            </UiFlex>

            <UiFlex class="my-3" v-if="discountVoucher > 0">
              <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Giảm giá Voucher</UiText>
              <UiText weight="semibold" size="sm" color="rose">- {{ toMoney(discountVoucher) }}%</UiText>
            </UiFlex>

            <UiFlex>
              <UiText weight="semibold" color="gray" size="sm" class="mr-auto">Thành tiền</UiText>
              <UiText weight="semibold" size="sm" color="primary">{{ toMoney(totalPrice) }} Xu</UiText>
            </UiFlex>
          </div>
        </UFormGroup>

        <UiFlex justify="end" class="gap-1 mt-4" v-if="!checkdone.recharge || !checkdone.mail">
          <UButton :loading="loading" @click="buyTool" color="yellow" >Mua Ngay</UButton>
          <UButton color="gray" :disabled="loading" @click="emits('close')">Đóng</UButton>
        </UiFlex>
      </div>
    </UForm>
  </UiContent>
</template>

<script setup>
const { toMoney } = useMoney()
const props = defineProps(['game'])
const emits = defineEmits(['done', 'close'])
const authStore = useAuthStore()

const loading = ref(false)

const checking = ref(false)
const checkdone = ref({
  status: false,
  recharge: false,
  mail: false
})

const stateBuy = ref({
  server_id: null,
  recharge: false,
  mail: false,
  voucher: null
})
const voucher = ref()
watch(() => stateBuy.value.server_id, (val) => (!!val) && checkAccount())

const price = computed(() => {
  let total = 0
  if(!!stateBuy.value.recharge) total = total + props.game.price?.recharge
  if(!!stateBuy.value.mail) total = total + props.game.price?.mail
  return total
})

const discount = computed(() => {
  if(!authStore.vip) return 0
  if(!props.game.discount) return 0
  if(!props.game.discount.vip) return 0
  return Number(props.game.discount.vip[authStore.vip])
})

const discountVoucher = computed(() => {
  if(!voucher.value) return 0
  if(!voucher.value.value) return 0
  return Number(voucher.value.value)
})

const totalPrice = computed(() => {
  const discount_vip = discount.value
  const discount_voucher = discountVoucher.value
  let discountTotal = discount_vip + discount_voucher
  discountTotal = discountTotal > 100 ? 100 : discountTotal

  return price.value - Math.floor((price.value * discountTotal) / 100)
})

const checkAccount = async () => {
  try {
    // Reset
    checkdone.value.status = false
    checkdone.value.recharge = checkdone.value.recharge = false
    stateBuy.value.mail = stateBuy.value.mail = false

    checking.value = true
    const send = { server_id: stateBuy.value.server_id, game: props.game.code}
    const data = await useAPI('game/tool/public/project/check', JSON.parse(JSON.stringify(send)))
    await authStore.setAuth()

    checkdone.value.recharge = stateBuy.value.recharge = data.recharge
    checkdone.value.mail = stateBuy.value.mail = data.mail
    checkdone.value.status = true
    checking.value = false
  }
  catch(e){
    checking.value = false
  }
}

const buyTool = async () => {
  try {
    loading.value = true

    const send = JSON.parse(JSON.stringify(stateBuy.value))
    send.game = props.game.code

    const data = await useAPI('game/tool/public/project/buy', send)
    await authStore.setAuth()

    stateBuy.value.recharge = data.recharge
    stateBuy.value.mail = data.mail

    loading.value = false
    emits('done', JSON.parse(JSON.stringify(stateBuy.value)))
  }
  catch(e){
    loading.value = false
  }
}
</script>