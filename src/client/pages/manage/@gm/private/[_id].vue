<template>
  <div>
    <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !game"/>
    

    <div class="relative h-full min-h-full pt-[var(--header-size)]" v-else>
      <LayoutGmPrivateHeader :game="game" />

      <UiFlex class="px-4 py-4 lg:gap-6 gap-0" items="start">
        <div class="
          HideScroll
          sticky top-[calc(var(--header-size)+1rem)]
          bg-gray-1000 rounded-2xl
          min-h-[calc(100vh-2rem-var(--header-size))] max-h-[calc(100vh-2rem-var(--header-size))] overflow-y-auto
          lg:min-w-[250px] lg:max-w-[250px] lg:w-[250px]
          hidden lg:flex
        ">
          <LayoutGmPrivateNav />
        </div>

        <UContainer 
          class="px-0 sm:px-0 lg:px-0" 
          style="min-height: calc(100% - var(--header-size));"
          :ui="{ constrained: 'max-w-[1200px] w-full' }"
        >
          <ManageGamePrivateInfo :game="game" class="mb-4" @update="getGame()"/>
          <NuxtPage :game="game"></NuxtPage>
        </UContainer>
      </UiFlex>
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
    const data = await useAPI('game/private/manage/project/_id', { _id: route.params._id })

    game.value = data
    loading.value = false
  }
  catch(e){
    return false
  }
}

getGame()
</script>