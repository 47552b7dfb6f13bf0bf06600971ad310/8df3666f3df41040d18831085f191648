<template>
  <div>
    <UiFlex justify="between" class="mb-2 gap-2 max-sm:flex-col">
      <UiTitle name="Mốc Thời Gian" icon="i-bxs-time" class="mr-auto" /> 

      <UiFlex class="gap-1 max-sm:w-full">
        <SelectDate v-model="page.range.start" placeholder="Bắt đầu" size="md" class="max-sm:grow" />
        <SelectDate v-model="page.range.end" placeholder="Kết thúc" size="md" class="max-sm:grow" />
      </UiFlex>
    </UiFlex>

    <DataEmpty :loading="loading" text="Xếp hạng chưa khả dụng" class="min-h-[300px]" v-if="!!loading || list.length == 0"></DataEmpty>

    <div v-else>
      <div class="mt-4 mb-8" v-if="list3.length > 0">
        <UiFlex justify="center" class="max-w-[400px] w-full mx-auto ">
          <UiFlex 
            v-if="list3[1]"
            justify="end" items="center"
            type="col"
            :style="`background: url(/images/rank/2.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
            class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[10px]"
          >
            <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[1].username }}</UiText>
            <UiText mini align="center" class="max-w-[99%]" weight="semibold">
              {{  useMoney().miniMoney(list3[1].value) }}
            </UiText>
          </UiFlex>

          <UiFlex 
            v-if="list3[0]"
            justify="end" items="center"
            type="col"
            :style="`background: url(/images/rank/1.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
            class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[-10px]"
          >
            <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[0].username }}</UiText>
            <UiText mini align="center" class="max-w-[99%]" weight="semibold">
              {{ useMoney().miniMoney(list3[0].value) }}
            </UiText>
          </UiFlex>

          <UiFlex 
            v-if="list3[2]"
            justify="end" items="center"
            type="col"
            :style="`background: url(/images/rank/3.png) no-repeat center / 100% 100%; aspect-ratio: 9 / 15;`" 
            class="w-[30%] max-w-[30%] min-w-[30%] grow px-4 pb-[10%] relative top-[10px]"
          >
            <UiText mini align="center" class="max-w-[99%]" size="sm" weight="semibold">{{ list3[2].username }}</UiText>
            <UiText mini align="center" class="max-w-[99%]" weight="semibold">
              {{ useMoney().miniMoney(list3[2].value) }}
            </UiText>
          </UiFlex>
        </UiFlex>
      </div>

      <UiFlex type="col" class="grow gap-4" v-if="list7.length > 0">
        <UiFlex v-for="(item, index) in list7" :key="index" class="w-full gap-2">
          <UBadge variant="soft" class="px-3">
            <UiText size="sm" class="italic">Hạng {{ item.rank < 10 ? `0${item.rank}` : item.rank }}</UiText>
          </UBadge>

          <div class="grow">
            <UiText mini size="md" weight="semibold" class="max-w-[70%]">{{ item.username }}</UiText>
          </div>

          <UBadge color="gray" variant="soft" class="ml-auto px-3" size="md">
             {{ useMoney().toMoney(item.value) }}
          </UBadge>
        </UiFlex>
      </UiFlex>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['game'])

const list = ref([])
const list3 = computed(() => {
  return list.value.filter((item, index) => index <= 2)
})

const list7 = computed(() => {
  return list.value.filter((item, index) => index > 2)
})

const loading = ref(true)
const page = ref({
  range: {
    start: null,
    end: null
  },
  total: 0,
  game: props.game?.code
})
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getRank()
  if(!val && !page.value.range.end) return getRank()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getRank()
  if(!val && !page.value.range.start) return getRank()
})


const getRank = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/private/public/project/rank/spend', JSON.parse(JSON.stringify(page.value)))

    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getRank, 1))
</script>