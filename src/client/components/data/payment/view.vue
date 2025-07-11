<template>
  <div>
    <DataEmpty :loading="loading" text="Không có thông tin" v-if="!!loading || !payment"/>

    <div v-else>
      <UiFlex justify="center" class="mb-6" v-if="payment.qrcode">
        <UiImg :src="payment.qrcode" class="w-[200px] md:max-w-[200px]"/>
      </UiFlex>

      <UCard :ui="{ body: { padding: 'p-4 sm:p-4'}}" class="mb-4">
        <UiFlex justify="between" class="mb-3">
          <UiText size="xs" weight="semibold" color="gray">Số tiền</UiText>
          <UiText size="sm" weight="bold">{{ payment.money ? toMoney(payment.money) : 0 }}</UiText>
        </UiFlex>
        <UiFlex justify="between">
          <UiText size="xs" weight="semibold" color="gray">Kênh nạp</UiText>
          <UiText size="sm" weight="bold">{{ payment.gate?.name || '...' }}</UiText>
        </UiFlex>
      </UCard>

      <div v-if="payment.gate.type != 1">
        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Người nhận</UiText>
            <UiText size="sm" weight="bold">{{ payment.gate?.person || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.gate?.person)">Copy</UButton>
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Số tài khoản</UiText>
            <UiText size="sm" weight="bold">{{ payment.gate?.number || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.gate?.number)">Copy</UButton>
        </UiFlex>

        <UiFlex justify="between">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Nội dung</UiText>
            <UiText size="sm" weight="bold">{{ payment.code || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.code)">Copy</UButton>
        </UiFlex>
      </div>

      <div v-if="payment.gate.type == 1">
        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Nhà mạng</UiText>
            <UiText size="sm" weight="bold">{{ payment.card?.net || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.card?.net)">Copy</UButton>
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Số Series</UiText>
            <UiText size="sm" weight="bold">{{ payment.card?.seri || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.card?.seri)">Copy</UButton>
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Mã PIN</UiText>
            <UiText size="sm" weight="bold">{{ payment.card?.pin || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.card?.pin)">Copy</UButton>
        </UiFlex>
      </div>

      <UButton color="yellow" block class="mt-4" size="lg" @click="emit('history')" v-if="!noHistory">Kiểm Tra Lịch Sử Giao Dịch</UButton>
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
const { toMoney } = useMoney()

const props = defineProps(['fetchId', 'noHistory'])
const emit = defineEmits(['history'])

const loading = ref(true)
const payment = ref(undefined)

const startCopy = (text) => {
  if(!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép vào bộ nhớ tạm thành công')
}

const fetch = async () => {
  try {
    const data = await useAPI('payment/public/view', { 
      _id: props.fetchId
    })
    loading.value = false
    payment.value = data
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>