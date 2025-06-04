<template>
  <UiFlex>
    <UInput 
      icon="i-bx-search" 
      size="lg" 
      placeholder="Tìm kiếm trò chơi..." 
      readonly 
      class="hidden md:inline-block" 
      @click="modal = true" 
      :ui="{ color: { gray: { outline: 'ring-0 bg-gray' } }}"
    />
    <UButton color="gray" icon="i-bx-search" square class="md:hidden" size="lg" @click="modal = true" />

    <UModal v-model="modal" :ui="{ 
      width: 'lg:max-w-2xl md:max-w-2xl sm:max-w-2xl',
    }">
      <div class="bg-card rounded-2xl p-4">
        <UiFlex class="mb-4 gap-2">
          <UiText weight="bold" class="text-md md:text-xl">Tìm Kiếm Trò Chơi</UiText>
          <UButton icon="i-bx-x" class="ml-auto" size="xs" color="white" square @click="modal = false"></UButton>
        </UiFlex>

        <UInput 
          icon="i-bx-search" 
          size="lg" 
          :ui="{ color: { gray: { outline: 'ring-0 bg-gray' } }}" 
          v-model="page.search" 
          placeholder="Nhập từ khóa tìm kiếm ?" 
          class="w-full mb-4" 
          :loading="loading" 
        />

        <div class="max-h-[60vh] overflow-y-auto HideScroll">
          <DataEmpty :text="textInfo" v-if="Object.keys(result).length == 0" />

          <UiFlex type="col" class="gap-2" v-else>
            <div v-for="(list, key) in result" :key="key" class="w-full">
              <UiText size="sm" color="yellow" weight="semibold" class="mb-2 capitalize">Game {{ key }}</UiText>

              <DataGameListMini :list="list" :os="key" @to="modal = false" :show-os="true" />
            </div>
          </UiFlex>
        </div>
      </div>
    </UModal>
  </UiFlex>
</template>

<script setup>
const modal = ref(false)
const loading = ref(false)
const result = ref({})

const page = ref({
  search: null
})
const delayTimer = ref(undefined)

const textInfo = computed(() => {
  if(!page.value.search) return 'Nhập từ khóa để bắt đầu tìm kiếm'
  if(!!page.value.search){
    if(!loading.value) return 'Không có dữ liệu'
    else return 'Đang tìm kiếm...'
  }
})

watch(() => page.value.search, () => {
  if (delayTimer.value) clearTimeout(delayTimer.value)
  loading.value = true
  delayTimer.value = setTimeout(() => searchItem(), 1000)
})

const searchItem = async () => {
  try {
    if(!page.value.search) throw true
    const data = await useAPI('game/public/search', JSON.parse(JSON.stringify(page.value)))

    result.value = data
    loading.value = false
  }
  catch(e){
    result.value = {}
    loading.value = false
  }
}
</script>