<template>
  <div>
    <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !game"/>
    
    <div class="relative h-full min-h-full pt-[var(--header-size)]" v-else>
      <LayoutGmChinaHeader :game="game" />

      <UContainer 
        class="p-4 sm:p-4 lg:p-4 w-full" 
        style="min-height: calc(100% - var(--header-size));"
        :ui="{ constrained: 'max-w-[1200px] w-full' }"
      >
        <ManageGameChinaInfo :game="game" class="mb-4" @update="getGame()" />
        <NuxtPage :game="game"></NuxtPage>
      </UContainer>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'gm',
  middleware: 'gm'
})

const route = useRoute()
const loading = ref(true)
const game = ref(undefined)

const getGame = async () => {
  try {
    loading.value = true
    const data = await useAPI('game/china/manage/project/_id', { _id: route.params._id })

    game.value = data
    loading.value = false
  }
  catch(e){
    return false
  }
}

getGame()
</script>