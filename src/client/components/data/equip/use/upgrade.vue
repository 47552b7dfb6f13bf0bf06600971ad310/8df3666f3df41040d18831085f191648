<template>
  <UiFlex>
    <UButton class="justify-center" size="xs" color="yellow" block icon="i-solar-sledgehammer-bold-duotone" @click="modal = true">Nâng Cấp</UButton>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
      <UiContent icon="i-solar-sledgehammer-bold-duotone" title="Cường Hóa" sub="Nâng cấp trang bị" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square :disabled="!!loading" @click="modal = false"></UButton>
        </template>

        <UiFlex type="col" class="gap-4 relative">
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="xs">Loại</UiText>
            <UiText weight="semibold" size="xs">{{ textFormat[type] }}</UiText>
          </UiFlex>
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="xs">Cấp hiện tại</UiText>
            <UiText weight="semibold" size="xs" color="gray">{{ level }}</UiText>
          </UiFlex>
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="xs">Cấp tiếp theo</UiText>
            <UiText weight="semibold" size="xs" color="yellow">{{ nextLevel }}</UiText>
          </UiFlex>
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="xs">Tỷ lệ thành công</UiText>
            <UiText weight="semibold" size="xs" color="rose">{{ rate }}%</UiText>
          </UiFlex>
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="xs">Lực chiến tăng</UiText>
            <UiText weight="semibold" size="xs" color="green">+ {{ useMoney().toMoney(powerUp) }}</UiText>
          </UiFlex>
          <UiFlex justify="between" class="w-full">
            <UiText weight="semibold" color="gray" size="xs">Giá đập</UiText>
            <UiText weight="semibold" size="xs" color="primary">- {{ useMoney().toMoney(price) }} Xu</UiText>
          </UiFlex>
        </UiFlex>

        <UiFlex class="mt-4 gap-0.5" justify="end">
          <UButton @click="action" :loading="loading" color="yellow" size="xs">Xác Nhận</UButton>
          <UButton color="gray" @click="modal = false" :disabled="loading" size="xs">Hủy</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['power', 'level', 'type'])
const emits = defineEmits(['done'])
const modal = ref(false)
const loading = ref(false)

const textFormat = {
  body: 'Trang Phục',
  wing: 'Cánh',
  weapon: 'Vũ Khí',
  pet: 'Thú Cưng',
  circle: 'Pháp Trận',
  title: 'Danh Hiệu',
}

const nextLevel = computed(() => props.level + 1)
const price = computed(() => nextLevel.value * 10000)
const rate = computed(() => {
  const value = nextLevel.value >= 10 ? 9.5 : nextLevel.value
  return 100 - (value * 10)
})

const powerUp = computed(() => {
  if(!props.power) return 0
  const now = props.power.power + Math.floor((props.power.power * props.level) / 2)
  const next = props.power.power + Math.floor((props.power.power * nextLevel.value) / 2)
  return next - now
})

const action = async () => {
  try {
    loading.value = true
    await useAPI('equip/public/action/upgrade', { type: props.type })

    loading.value = false
    modal.value = false
    emits('done', { type: props.type, level: nextLevel.value })
  }
  catch(e){
    loading.value = false
  }
}
</script>