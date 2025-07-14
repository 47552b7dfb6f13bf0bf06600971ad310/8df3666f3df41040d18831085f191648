<template>
  <DataEmpty :loading="loading" text="Trò chơi chưa sẵn sàng, vui lòng quay lại sau" class="min-h-[300px]" v-if="!!loading || !(!!source && !!config)" />

  <div v-else>
    <UiFlex justify="between" class="gap-2 mb-8">
      <UiTitle name="Tháp Trứng" icon="i-game-icons-egg-clutch" />
      <UButton @click="modal.reset = true" v-if="!!authStore.isLogin" icon="i-bx-reset" color="gray">Chơi Lại</UButton>
    </UiFlex>

    <DataGamePrivateEventEggBox :source="source" @select="select" class="mb-6" />

    <UModal v-model="modal.dam" prevent-close>
      <UiContent title="Đập Trứng" sub="Xác nhận thông tin đập trứng" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!damming" @click="modal.dam = false"></UButton>
        </template>

        <UForm :state="state" :validate="validate" @submit="dam" v-if="!!authStore.isLogin">
          <UFormGroup label="Tọa độ" name="map" v-if="!!state.row && !!state.index">
            <UInput :model-value="`Hàng ${format[state.row]} - ${state.index}`" readonly />
          </UFormGroup>

          <UFormGroup label="Giá đập" name="price" v-if="!!state.price">
            <template #hint>
              <DataUserCoin size="xs" />
            </template>
            
            <UInput :model-value="`${useMoney().toMoney(state.price)} Xu`" readonly />
          </UFormGroup>

          <UFormGroup label="Máy chủ" name="server">
            <SelectGameServer v-model="state.server" :game="game.code" type="private" />
          </UFormGroup>
          
          <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
            <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton type="submit" color="yellow" :loading="damming">Đập Ngay</UButton>
            <UButton color="gray" :disabled="!!damming" @click="modal.dam = false">Hủy</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>

    <UModal v-model="modal.reset" preventClose>
      <UiContent title="Chơi Lại" class="bg-card rounded-2xl p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="rose" variant="soft">
          <template #description>
            Bạn chắc chắn muốn chơi lại tháp trứng từ đầu ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="reset" :loading="reseting" color="rose">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.reset = false" :disabled="!!reseting" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <UModal v-model="modal.gift" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <UiContent title="Phần Thưởng" class="bg-card rounded-2xl p-4" no-dot v-if="!!gift">
        <UiFlex type="col" v-if="!!gift.item">
          <DataGamePrivateItemImage :src="gift.item.item_image" size="120" :game="game.code" />

          <UiText weight="bold" align="center" size="lg" class="max-w-[90%] leading-[1.5rem] mb-2 mt-4">
            {{ gift.item.item_name }}
          </UiText>
          <UiText size="xs" weight="semibold" class="line-clamp-1" color="gray">Vật Phẩm</UiText>
          <UBadge size="md" color="gray" variant="soft" class="bg-gray-1000 px-4 md:px-6 max-w-full mt-3" v-if="!!gift.amount && gift.amount > 0">x {{ useMoney().toMoney(gift.amount) }}</UBadge>
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

const props = defineProps(['game'])

const modal = ref({
  dam: false,
  reset: false,
  gift: false
})

const state = ref({
  row: null,
  index: null,
  server: null,
  role: null,
  price: null,
  code: props.game.code
})

const format = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }

const config = ref(null)
const source = ref(null)

const loading = ref(true)
const damming = ref(false)
const reseting = ref(false)
const reload = ref(0)
const gift = ref()

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  if (!!authStore.isLogin && (authStore.profile.currency.coin < state.price)) errors.push({ path: 'price', message: 'Số dư xu không đủ' })
  if (!state.row || !state.index) errors.push({ path: 'map', message: 'Vui lòng chọn quả trứng muốn đập' })
  return errors
}

const select = ({ row, index }) => {
  state.value.row = row
  state.value.index = index
  state.value.price = !!config.value[row] ? config.value[row]['price'] : 0
  modal.value.dam = true
}

const reset = async () => {
  try {
    reseting.value = true
    await useAPI('game/private/public/egg/reset', { game: props.game.code })

    reseting.value = false
    modal.value.reset = false
    getEgg()
  }
  catch {
    reseting.value = false
  }
}

const dam = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước để chơi')

    damming.value = true
    state.value.game = props.game.code
    const data = await useAPI('game/private/public/egg/damming', JSON.parse(JSON.stringify(state.value)))

    gift.value = data
    damming.value = false
    modal.value.dam = false
    reload.value++
    getEgg()

    await nextTick()
    modal.value.gift = true
  }
  catch {
    damming.value = false
  }
}

const getEgg = async () => {
  try {
    const data = await useAPI('game/private/public/egg/get', { game: props.game.code })
    source.value = data.source
    config.value = data.config
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

getEgg()
watch(() => authStore.isLogin, () => getEgg())
</script>