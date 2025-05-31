<template>
	<UiContent title="Nạp Tệ" sub="Sử dụng tệ nạp có thể mua vật phẩm trong trò chơi" class="bg-card rounded-2xl p-4" no-dot>
		<template #more>
			<UButton icon="i-bx-x" square color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
		</template>

		<UForm ref="form" :state="state" :validate="validate" @submit="submit">
			<UFormGroup label="Chọn số lượng tệ nạp" name="coin">
				<UiFlex class="gap-1">
					<USelectMenu v-model="state.coin" :options="moneys" value-attribute="value" option-attribute="label" size="lg" class="grow" />
					<UButton type="submit" size="md" :loading="loading" color="yellow">Nạp Ngay</UButton>
				</UiFlex>
			</UFormGroup>

			<UFormGroup label="Lịch sử nạp">
				<DataGameChinaPaymentHistory :game="game.key" :reload="reloadHistory" />
			</UFormGroup>
		</UForm>
	</UiContent>
</template>

<script setup>
const configStore = useConfigStore()
const props = defineProps(['game'])
const emits = defineEmits(['close'])
const authStore = useAuthStore()
const form = ref()
const loading = ref(false)
const reloadHistory = ref(0)
const yuan = configStore.config.yuan
// State
const state = ref({
  coin: yuan,
	game: props.game.key
})

// Moneys
const moneys = [
	{ label: `1 tệ - ${yuan} Xu`, value: yuan },
	{ label: `5 tệ - ${yuan * 5} Xu`, value: yuan * 5 },
	{ label: `10 tệ - ${yuan * 10} Xu`, value: yuan * 10 },
	{ label: `20 tệ - ${yuan * 20} Xu`, value: yuan * 20 },
	{ label: `30 tệ - ${yuan * 30} Xu`, value: yuan * 30 },
	{ label: `50 tệ - ${yuan * 50} Xu`, value: yuan * 50 },
	{ label: `100 tệ - ${yuan * 100} Xu`, value: yuan * 100 },
]

// Validate
const validate = (st) => {
  const errors = []
  if (!st.coin) errors.push({ path: 'coin', message: 'Vui lòng chọn số tệ nạp' })
  return errors
}

// Submit
const submit = async () => {
  try {
    loading.value = true
    await useAPI('game/china/public/payment/create', JSON.parse(JSON.stringify(state.value)))
		await authStore.setAuth()

    loading.value = false
    reloadHistory.value = reloadHistory.value + 1
  }
  catch (e) {
    loading.value = false
  }
}
</script>