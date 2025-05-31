<template>
  <UiContent title="Giftcode" sub="Mã quà tặng trò chơi" no-dot>
    <template #more>
      <UButton icon="i-bx-x" square color="gray" class="ml-auto" size="2xs" :disabled="!!loading.check || !!loading.receive" @click="emits('close')"></UButton>
    </template>

    <UForm ref="form" :state="state" :validate="validate" @submit="receive">
      <UFormGroup name="code" label="Mã quà tặng">
        <UiFlex class="gap-1">
          <UInput class="grow" size="md" v-model="state.code" placeholder="Nhập mã tại đây" />
          <UButton size="sm" class="color-blue-light bg-anim-light" :loading="loading.check" :disabled="!!loading.receive" @click="check">Kiểm tra</UButton>
        </UiFlex>

        <UiText color="orange" size="xs" weight="semibold" class="italic pl-3 mt-2" v-if="!!giftcode">Xóa mã đã nhập để quay lại</UiText>
      </UFormGroup>

      <div v-if="!!giftcode">
        <UFormGroup label="Máy chủ" name="server">
          <SelectGameServer v-model="state.server" :game="game.code" type="private" />
        </UFormGroup>

        <UFormGroup label="Nhân vật" name="role" v-if="!!state.server">
          <SelectGameRole v-model="state.role" :server="state.server" :game="game.code" type="private" />
        </UFormGroup>

        <UFormGroup label="Giới hạn" v-if="giftcode.limit > 0">
          <UInput :model-value="giftcode.limit == 0 ? 'Không giới hạn' : `${giftcode.limit} người`" readonly />
        </UFormGroup>

        <UFormGroup label="Sử dụng">
          <UInput :model-value="!!giftcode.justone ? 'Một lần duy nhất' : 'Một lần cho mỗi máy chủ'" readonly />
        </UFormGroup>

        <UFormGroup label="Phần thưởng" >
          <div class="bg-gray ring-1 ring-gray-800 rounded-2xl p-4">
            <DataGamePrivateItemList :items="giftcode.gift" justify="center" @fast="fastCode" :game="game.code" />
          </div>
        </UFormGroup>
      </div>

      <UFormGroup label="Mã công khai">
        <DataGamePrivateGiftcodePublic :game="game" @fast="fastCode" class="my-4" v-if="!giftcode" />
      </UFormGroup>

      <UiFlex class="gap-1">
        <UButton @click="modal.history = true" color="gray" icon="i-bx-history" class="mr-auto">Lịch sử</UButton>

        <UButton type="submit" size="md" color="yellow" :loading="loading.receive" :disabled="!!loading.check" v-if="!!giftcode">Nhận Thưởng</UButton>
        <UButton color="gray" size="md" @click="emits('close')" :disabled="!!loading.check || !!loading.receive">Đóng</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal.history" prevent-close :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent title="Lịch Sử" sub="Các mã Giftcode đã nhập" no-dot class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history = false"></UButton>
        </template>

        <DataGamePrivateGiftcodeHistory :game="props.game.code" />
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['done', 'close'])
const giftcode = ref(undefined)
const form = ref()

const loading = ref({
  check: false,
  receive: false
})

const modal = ref({
  history: false
})

// State
const state = ref({
  code: null,
  server: null,
  role: null,
  game: props.game.code,
})
watch(() => state.value.code, (val) => !val && (giftcode.value = null))

// Validate
const validate = (state) => {
  const errors = []
  if (!state.code) errors.push({ path: 'code', message: 'Vui lòng nhập đầy đủ' })
  if (!state.server) errors.push({ path: 'server', message: 'Vui lòng chọn máy chủ' })
  if (!state.role) errors.push({ path: 'role', message: 'Vui lòng chọn nhân vật' })
  return errors
}

// Action
const fastCode = (code) => {
  state.value.code = code
  check()
}

const check = async () => {
  try {
    loading.value.check = true
    const data = await useAPI('game/private/public/giftcode/check', JSON.parse(JSON.stringify(state.value)))

    giftcode.value = data
    loading.value.check = false
  }
  catch (e) {
    giftcode.value = undefined
    loading.value.check = false
  }
}

const receive = async () => {
  try {
    loading.value.receive = true
    await useAPI('game/private/public/giftcode/receive', JSON.parse(JSON.stringify(state.value)))

    giftcode.value = null
    state.value.code = null
    
    setTimeout(() => {
      loading.value.receive = false
      emit('done')
    }, 1000)
  }
  catch (e) {
    loading.value.receive = false
  }
}
</script>