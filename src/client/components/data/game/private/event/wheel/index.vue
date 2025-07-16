<template>
  <div>
    <UiFlex justify="between" class="gap-2 mb-8">
      <UiTitle name="Bánh Quay" icon="i-lucide-ferris-wheel" />
      <DataUserCoin v-if="!!authStore.isLogin" />
    </UiFlex>

    <DataGamePrivateEventWheelBox 
      :items="items" 
      :gift="gift" 
      :spin="spin" 
      :game="game"
      @done="doneSpin" 
      class="mb-6"
    />

    <UForm :state="state" :validate="validate" @submit="spinWheel" v-if="!!authStore.isLogin">
      <UFormGroup label="Máy chủ" name="server" class="grow">
        <SelectGameServer v-model="state.server" :game="game.code" type="private" />
      </UFormGroup>
      
      <UFormGroup label="Nhân vật" name="role" class="grow" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
      </UFormGroup>
      
      <UiFlex justify="between">
        <UBadge color="green" variant="soft" size="lg">{{ useMoney().toMoney(game.rate.wheel) }} Xu / lượt</UBadge>
        <UButton type="submit" color="yellow" :loading="loading">Quay Ngay</UButton>
      </UiFlex>
    </UForm>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game'])

const state = ref({
  server: null,
  role: null,
  game: props.game.code
})

const loading = ref(false)
const spin = ref(0)
const items = ref([])
const gift = ref(null)

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const doneSpin = async () => {
  loading.value = false
  getWheel()
}

const spinWheel = async () => {
  try {
    loading.value = true
    state.value.game = props.game.code
    const data = await useAPI('game/private/public/project/wheel/spin', JSON.parse(JSON.stringify(state.value)))

    gift.value = data
    spin.value++
  }
  catch {
    loading.value = false
  }
}

const getWheel = async () => {
  const data = await useAPI('game/private/public/project/wheel/get', { game: props.game.code })
  items.value = data
}

getWheel()
</script>