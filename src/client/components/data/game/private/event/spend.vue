<template>
  <div>
    <UiFlex class="mb-2">
      <UTabs v-model="tab" :items="tabs" :content="false" class="w-full md:w-auto"></UTabs>
    </UiFlex>

    <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" text="Chưa có mốc thưởng ở sự kiện này" class="min-h-[300px]"></DataEmpty>
    
    <UiFlex type="col" class="gap-2" v-else>
      <UCard v-for="(row, index) in list" :key="index" class="bg-gray ring-1 w-full overflow-hidden">
        <UiFlex class="gap-6 pt-[25px]">
          <UiText 
            color="gray" 
            weight="bold"
            class="
              absolute top-0 left-0
              px-4 py-2
              bg-gray-1000
              rounded-br-2xl
              text-sm
            "
          >
            Tiêu {{ toMoney(row.need) }} Xu
          </UiText>

          <DataGamePrivateItemList :items="row.gift" :size="45" :game="game.code" />

          <UButton 
            :color="statusFormat[row.status].color" 
            :disabled="row.status != 0" 
            @click="openReceive(row)" 
            class="
              px-4 md:px-6 
              absolute right-0 top-0
              rounded-tl-none rounded-br-none
            "
          >
            {{ statusShow(row.status, row.need) }}
          </UButton>
        </UiFlex>
      </UCard>
    </UiFlex>

    <UModal v-model="modal.receive" prevent-close>
      <DataGamePrivateEventReceive 
        :event="stateReceive" 
        :game="game" 
        @close="modal.receive = false"
        @done="doneReceive" 
      />
    </UModal>
  </div>
</template>

<script setup>
const props = defineProps(['game'])
const emits = defineEmits(['start-receive'])

const authStore = useAuthStore()
const { toMoney } = useMoney()

const loading = ref(true)
const modal = ref({
  receive: false
})

const list = ref([])
const statistical = computed(() => props.game.user)

const type = ref('spend.day.coin')
watch(() => type.value, () => getList())

const tab = ref(0)
const tabs = [
  { label: 'Ngày', key: 'spend.day.coin' },
  { label: 'Tuần', key: 'spend.week.coin' },
  { label: 'Tháng', key: 'spend.month.coin' },
  { label: 'Năm', key: 'spend.total.coin' },
]
watch(() => tab.value, (val) => type.value = tabs[val]['key'])

const columns = [{
  key: 'need',
  label: 'Mốc',
},{
  key: 'gift',
  label: 'Thưởng',
},{
  key: 'actions'
}]

const statusFormat = {
  '99': { color: 'gray', label: 'Lỗi' },
  '-3': { color: 'gray', label: 'Chưa Đăng Nhập' },
  '-2': { color: 'gray', label: 'Chưa Đăng Ký' },
  '-1': { color: 'gray', label: 'Chưa Đạt' },
  '0': { color: 'primary', label: 'Nhận Ngay' },
  '1': { color: 'gray', label: 'Đã Nhận' },
}

const statusShow = (number, need) => {
  if(number != -1 || !authStore.isLogin) return statusFormat[number].label

  const arrType = type.value.split('.')
  if(arrType.length > 1){
    let info = JSON.parse(JSON.stringify(statistical.value)) 
    arrType.forEach(i => info = info[i])
    return `${toMoney(info)} / ${toMoney(need)}`
  }
  else {
    return `${toMoney(statistical.value[type.value])} / ${toMoney(need)}`
  }
}

const stateReceive = ref(null)

const openReceive = (row) => {
  emits('start-receive')
  stateReceive.value = row
  modal.value.receive = true
}

const doneReceive = () => {
  modal.value.receive = false
  getList()
  emit('done')
}

const getList = async () => {
  try {
    loading.value = true
    const get = await useAPI('game/private/public/project/event/list', { 
      type: type.value,
      game: props.game.code
    })

    list.value = get.list
    loading.value = false
  }
  catch(e){
    list.value = []
    loading.value = false
  }
}

watch(() => authStore.isLogin, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>