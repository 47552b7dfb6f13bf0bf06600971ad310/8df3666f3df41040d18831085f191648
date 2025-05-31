<template>
  <UiContent title="Cống Hiến" sub="Giúp gia tộc lên cấp nhanh" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading" @click="emit('close')"></UButton>
    </template>

    <UForm ref="form" :state="state" @submit="action">
      <UFormGroup>
        <div class="bg-gray rounded-2xl p-4">
          <UiFlex justify="between" class="mb-4">
            <UiText color="gray" size="sm">Số xu cống hiến</UiText>
            <UiText color="gray" size="sm" weight="semibold">
              {{ useMoney().toMoney(state.coin || 0) }} Xu
            </UiText>
          </UiFlex>

          <UInput 
            v-model="state.coin" 
            variant="none" 
            type="number" 
            size="3xl" 
            placeholder="Nhập số xu muốn cống hiến" 
            class="font-bold"
          />
        </div>
      </UFormGroup>

      <UiFlex class="mt-4 gap-1">
        <UButton class="color-blue-light bg-anim-light mr-auto" size="md" @click="modal = true">Lịch Sử</UButton>

        <UButton @click="action" :loading="loading" color="yellow" size="md">Xác Nhận</UButton>
        <UButton color="gray" size="md" @click="emit('close')" :disabled="!!loading" >Đóng</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[350px]'}">
      <DataGuildListDonate :guild="guild" @close="modal = false" />
    </UModal>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['guild'])
const emit = defineEmits(['close', 'done'])
const loading = ref(false)

const modal = ref(false)
const state = ref({
  coin: null
})

const action = async (_id) => {
  try {
    if(!state.value.coin || state.value.coin < 1) return useNotify().error('Vui lòng nhập số xu cống hiến')
    loading.value = true
    await useAPI('guild/public/action/donate', JSON.parse(JSON.stringify(state.value)))

    loading.value = false
    state.value.coin = null
    await authStore.setAuth()
    emit('close')
  }
  catch (e) {
    loading.value = false
  }
}
</script>