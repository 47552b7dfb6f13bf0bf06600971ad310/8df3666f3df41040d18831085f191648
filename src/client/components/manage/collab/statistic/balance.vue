<template>
  <div class="grid grid-cols-12 gap-2">
    <UCard class="sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
      <UiFlex justify="between">
        <UAvatar icon="i-bxs-badge-dollar" size="2xl" class="mr-4" />
        <UiFlex type="col" items="end">
          <UiText color="gray" align="end">Số Dư Tài Khoản</UiText>
          <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
          <UiText v-else color="yellow" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.money) }}</UiText>
        </UiFlex>
      </UiFlex>
    </UCard>

    <UCard class="sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
      <UiFlex justify="between">
        <UAvatar icon="i-bxs-badge-dollar" size="2xl" class="mr-4" />
        <UiFlex type="col" items="end">
          <UiText color="gray" align="end">Số Dư Kênh Thanh Toán</UiText>
          <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
          <UiText v-else color="cyan" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.gatepay) }}</UiText>
        </UiFlex>
      </UiFlex>
    </UCard>
  </div>
</template>

<script setup>
const props = defineProps(['collab'])
const { toMoney } = useMoney()
const loading = ref(true)
const data = ref({
  money: 0,
  gatepay: 0
})

const getData = async () => {
  try {
    loading.value = true
    const get = await useAPI('collab/manage/code/statistic/balance', { 
      collab: props.collab
    })

    data.value = get
    loading.value = false
  }
  catch {
    return
  }
}

getData()
</script>