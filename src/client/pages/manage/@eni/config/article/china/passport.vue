<template>
  <UiContent 
    title="China Passport" 
    sub="Hướng dẫn thêm căn cước game China" 
    class="max-w-4xl mx-auto"
  >
    <div v-if="!loading.page">
      <UiEditor v-model="state.content" class="mb-4" />

      <UiFlex justify="end">
        <UButton color="yellow" @click="update" icon="i-bx-save">Lưu</UButton>
      </UiFlex>
    </div>
  </UiContent>
</template>

<script setup>
const loading = ref({
  page: true,
  update: false
})

const state = ref({
  content: undefined,
  type: 'passportchina'
})

const getConfig = async () => {
  try {
    const data = await useAPI('config/manage/article/get', JSON.parse(JSON.stringify(state.value)))
    state.value.content = data
    loading.value.page = false
  }
  catch(e){
    loading.value.page = false
  }
}

const update = async (change) => {
  try {
    loading.value.update = true

    await useAPI('config/manage/article/update', JSON.parse(JSON.stringify(state.value)))
    loading.value.update = true
    getConfig()
  }
  catch(e) {
    loading.value.update = true
  }
}

getConfig()
</script>