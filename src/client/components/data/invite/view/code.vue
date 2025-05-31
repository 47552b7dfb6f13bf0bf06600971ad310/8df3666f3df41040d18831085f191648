<template>
  <UiFlex>
    <UButton color="yellow" icon="i-bxs-copy" size="md" :loading="!!loading" @click="getCode">Mã Mời</UButton>

    <UModal v-model="modal">
      <UiContent title="Mã Giới Thiệu" sub="Sử dụng mã và đường dẫn cung cấp để mời bạn" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>

        <div v-if="!!code">
          <UiFlex justify="between" class="mb-6">
            <div>
              <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Mã</UiText>
              <UiText size="sm" weight="bold" color="yellow">{{ code }}</UiText>
            </div>
            <UButton color="gray" size="xs" @click="startCopy(code)">Copy</UButton>
          </UiFlex>

          <UiFlex justify="between">
            <div>
              <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">Đường dẫn</UiText>
              <UiText size="sm" weight="bold" color="yellow">{{ urlCode }}</UiText>
            </div>
            <UButton color="gray" size="xs" @click="startCopy(urlCode)">Copy</UButton>
          </UiFlex>
        </div>

        <UiContent title="Phúc lợi" sub="Theo cấp độ của bạn" v-if="!!level" class="mt-6">
          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="xs">Mời tối đa</UiText>
            <UiText weight="semibold" size="sm">
              <span class="text-yellow-500">{{ level.limit.invite }}</span>
              bạn
            </UiText>
          </UiFlex>

          <UiFlex justify="between" class="mb-3">
            <UiText weight="semibold" color="gray" size="xs">Mời bạn tặng</UiText>
            <UiText weight="semibold" size="sm">
              <span class="text-yellow-500">{{ level.gift.invite }} </span>
              ECoin
            </UiText>
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold" color="gray" size="xs">Bạn bè nạp tặng</UiText>
            <UiText weight="semibold" size="sm">
              <span class="text-yellow-500">{{ level.bonus.invite.payment }}%</span>
              tiền nạp
            </UiText>
          </UiFlex>
        </UiContent>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig()
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()

const code = ref(null)
const level = ref(null)
const loading = ref(false)
const modal = ref(false)

const urlCode = computed(() => {
  if(!code.value) return null
  return `${runtimeConfig.public.clientURL}?i=${code.value}`
})

const startCopy = (text) => {
  if(!isSupported.value || !text) return
  copy(text)
  useNotify().success('Sao chép thành công')
}

const getCode = async () => {
  try {
    code.value = null
    level.value = null
    loading.value = true
    const data = await useAPI('invite/public/code')

    code.value = data.code
    level.value = data.level
    loading.value = false
    modal.value = true
  }
  catch (e) {
    code.value = null
    level.value = null
    loading.value = false
  } 
}
</script>