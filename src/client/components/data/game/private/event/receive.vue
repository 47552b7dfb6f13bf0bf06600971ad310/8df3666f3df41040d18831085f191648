<template>
  <UiContent no-dot title="Sự Kiện" sub="Nhận thưởng sự kiện" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" square color="gray" class="ml-auto" size="2xs" @click="emits('close')"></UButton>
    </template>

    <UForm :state="state" :validate="validate" @submit="receive">
      <UFormGroup label="Loại" name="event">
        <UInput :model-value="typeFormat[event.type]" readonly/>
      </UFormGroup>

      <UFormGroup label="Mốc nhận" name="event">
        <UInput :model-value="useMoney().toMoney(event.need)" readonly/>
      </UFormGroup>

      <UFormGroup label="Máy chủ" name="server">
        <SelectGameServer v-model="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
      </UFormGroup>

      <UFormGroup label="Vật phẩm" name="gift">
        <div class="bg-gray ring-1 ring-gray-800 rounded-2xl p-4">
          <DataGamePrivateItemList :items="event.gift" justify="center" size="50" :game="game.code" />
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton type="submit" :loading="loading" color="yellow" size="md">Nhận</UButton>
        <UButton color="gray" :disabled="loading"  size="md" @click="emits('close')">Đóng</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game', 'event'])
const emits = defineEmits(['done','close'])
const loading = ref(false)

const state = ref({
  event: props.event?._id, 
  server: props.server,
  role: props.role,
  game: props.game?.code,
})

const typeFormat = {
  'login.week': 'Điểm Danh Tuần',
  'login.month': 'Điểm Danh Tháng',
  'login.total': 'Điểm Danh Tổng',
  'spend.day.coin': 'Tiêu Xu Ngày',
  'spend.week.coin': 'Tiêu Xu Tuần',
  'spend.month.coin': 'Tiêu Xu Tháng',
  'spend.total.coin': 'Tiêu Xu Tổng',
}

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

const receive = async () => {
  try {
    loading.value = true
    await useAPI('game/private/public/project/event/receive', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    emits('done')
	}
	catch(e){
    loading.value = false
  }
}
</script>