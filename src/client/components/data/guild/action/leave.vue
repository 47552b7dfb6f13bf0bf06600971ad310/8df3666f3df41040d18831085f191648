<template>
  <UiContent title="Rời Khỏi" sub="Xác nhận rời gia tộc" class="bg-card rounded-2xl p-4" no-dot>
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!loading" @click="emit('close')"></UButton>
    </template>

    <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="red" variant="soft">
      <template #description>
        Bạn chắc chắn muốn rời khỏi gia tộc <b>{{ guild.name }}</b> ?
      </template>
    </UAlert>

    <UiFlex class="mt-4 gap-1" justify="end">
      <UButton @click="action" :loading="loading" color="red" size="md">Xác Nhận</UButton>
      <UButton color="gray" size="md" @click="emit('close')" :disabled="!!loading" >Đóng</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['guild'])
const emit = defineEmits(['close', 'done'])
const loading = ref(false)

const action = async (_id) => {
  try {
    loading.value = true
    await useAPI('guild/public/action/leave')

    loading.value = false
    emit('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>