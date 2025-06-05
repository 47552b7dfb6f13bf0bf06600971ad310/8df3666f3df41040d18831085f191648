<template>
  <div>
    <DataEmpty :loading="loading.equip" v-if="!!loading.equip || !equips"></DataEmpty>

    <UiFlex class="relative" v-else>
      <UiFlex class="absolute top-0 left-0 w-full gap-1 p-2">
        <UiText color="gray" size="sm" weight="semibold" class="ml-2 mr-auto">Chọn giới tính</UiText>
        <UButton icon="i-bx-male-sign" :color="state == 1 ? 'blue' : 'gray'" @click="state = 1"></UButton>
        <UButton icon="i-bx-female-sign" :color="state == 2 ? 'rose' : 'gray'" @click="state = 2"></UButton>
      </UiFlex>

      <DataCharacterView class="bg-gray rounded-2xl" v-if="!!select" :source="{ body: select }" view="info" />
      <UButton :loading="loading.sex" color="yellow" class="absolute bottom-2 right-2" @click="submit">Xác Nhận</UButton>
    </UiFlex>
  </div>
</template>

<script setup>
const emits = defineEmits(['done'])

const state = ref(1)

const equips = ref(null)

const loading = ref({
  equip: true,
  sex: false
})

const select = computed(() => {
  if(!equips.value) return null
  const index = equips.value.findLastIndex(i => i.sex == state.value)
  return index > -1 ? equips.value[index] : null
})

const submit = async () => {
  try {
    loading.value.sex = true
    await useAPI('auth/public/character/sex', { sex: state.value })

    loading.value.sex = false
    emits('done')
  }
  catch(e){
    loading.value.sex = false
  }
}

const getDefaultEquip = async () => {
  try {
    loading.value.equip = true
    const data = await useAPI('equip/public/default')
    equips.value = data

    loading.value.equip = false
  }
  catch(e){
    return
  }
}

onMounted(() => setTimeout(getDefaultEquip, 1))
</script>