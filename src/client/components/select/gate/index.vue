<template>
  <UiFlex class="gap-1 md:gap-2" wrap>
    <UiButtonSelect
      v-for="(option, index) in options" :key="index"
      @click="gate = option._id"
      :active="!!gate && gate == option._id"
      class="p-4 md:p-6"
    >
      <UiFlex type="col">
        <UiText weight="bold" class="text-sm md:text-base">{{ option.name }}</UiText>
        <UiText color="gray" class="text-xs" weight="semibold">{{ option.type == 1 ? 'Card' : option.type == 2 ? 'QR Bank' : 'QR Wallet' }}</UiText>
      </UiFlex>
    </UiButtonSelect>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  gate: Object,
  options: {
    type: Array,
    default: () => []
  },
  auto: Boolean
})

const emit = defineEmits(['update:modelValue', 'update:gate'])

const loading = ref(true)

const gate = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
    emit('update:gate', options.value.find(i => i._id === value))
  } 
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === gate.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('gate/public/select')

    options.value = options.value.concat(list)
    if(!!props.auto && options.value.length > 0) gate.value = options.value[0]._id
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>