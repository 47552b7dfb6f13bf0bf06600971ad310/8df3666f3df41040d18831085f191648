<template>
  <UiFlex class="inline-flex">
    <UiFlex 
      justify="center" 
      class="EquipItem inline-flex rounded-2xl w-[50px] h-[50px] p-1 cursor-pointer" 
      :class="{[`equip-level-${levelFormat.ring}`] : !!levelFormat }"
      @click="modal = true"
    >
      <UiText class="text-[10px] z-[1]" align="center" color="gray" v-if="!data">{{ textFormat[type] }}</UiText>
      <UiImg :src="`/character/${type}/${data[type].res}/item.png`" :w="1" :h="1" img-size="100px" class="w-full rounded-2xl overflow-hidden z-[1]" v-else />
    </UiFlex>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[400px]'}">
      <UiContent :title="textFormat[type]" class="bg-card rounded-2xl p-4" :class="{[`equip-level-${levelFormat.ring}`] : !!levelFormat }">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="modal = false"></UButton>
        </template>

        <div v-if="!!tabs">
          <UTabs v-model="tab" :items="tabs" class="mb-3"></UTabs>

          <DataEquipInfo :source="source" :level="level" :type="type" :power="totalPower" v-if="tab == 0">
            <UiFlex justify="between" class="w-full gap-2" v-if="!!levelFormat">
              <UiText weight="semibold" color="gray" size="xs">Phẩm chất</UiText>
              <UiText weight="semibold" size="xs" style="color: var(--equip-level-color)">{{ levelFormat.title }}</UiText>
            </UiFlex>

            <template #right>
              <DataEquipUseUpgrade class="mt-1 w-full" :type="type" :level="level" :power="power" @done="upgrade"/>
            </template>
          </DataEquipInfo>

          <DataEquipBag :type="type" v-if="tab == 1" @use="use" />
          <DataEquipShop :type="type" v-if="tab == 2" @buy="emits('buy')" />
        </div>

        <DataEquipInfo :source="source" :level="level" :power="totalPower" :type="type" v-else>
          <UiFlex justify="between" class="w-full gap-2" v-if="!!levelFormat">
            <UiText weight="semibold" color="gray" size="xs">Phẩm chất</UiText>
            <UiText weight="semibold" size="xs" style="color: var(--equip-level-color)">{{ levelFormat.title }}</UiText>
          </UiFlex>
        </DataEquipInfo>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const authStore = useAuthStore()

const props = defineProps(['source', 'level', 'power', 'type', 'user'])
const emits = defineEmits(['use', 'buy', 'upgrade'])

const modal = ref(false)

const tab = ref(0)
const tabs = computed(() => {
  if(!authStore.isLogin) return null
  else {
    if(props.user == authStore.profile._id) return [
      { label: 'Thông tin' },
      { label: 'Kho đồ' },
      { label: 'Cửa hàng' },
    ]
    return null
  }
})

const totalPower = computed(() => {
  if(!props.power) return 0
  return props.power.power + Math.floor((props.power.power * props.level) / 2)
})

const levelFormat = computed(() => {
  if(!props.level) return { title: 'Sơ cấp', ring: 0 }
  if(props.level == 0) return { title: 'Sơ cấp', ring: 0 }
  else if(props.level <= 5) return { title: 'Hạ cấp', ring: 1 }
  else if(props.level <= 10) return { title: 'Trung cấp', ring: 2 }
  else if(props.level <= 15) return { title: 'Thượng cấp', ring: 3 }
  else if(props.level <= 20) return { title: 'Đỉnh phong', ring: 4 }
  else return { title: 'Truyền thuyết', ring: 5 }
})

const data = computed(() => {
  if(!props.source) return null
  if(!props.type) return null
  const result = {}
  result[props.type] = props.source
  return result
})

const textFormat = {
  body: 'Trang Phục',
  wing: 'Cánh',
  weapon: 'Vũ Khí',
  pet: 'Thú Cưng',
  circle: 'Pháp Trận',
  title: 'Danh Hiệu',
}

const use = async (data) => {
  await nextTick()
  emits('use', { type: props.type, equip: data })
  await nextTick()
  modal.value = false
}

const upgrade = async (data) => {
  await nextTick()
  emits('upgrade', data)
}

</script>