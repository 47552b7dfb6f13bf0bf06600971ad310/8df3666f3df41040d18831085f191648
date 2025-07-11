<template>
  <ClientOnly>
    <swiper-container 
      ref="containerRef" 
      :slidesPerView="1" 
      :spaceBetween="0"
      :autoplay="{ delay: 2500, disableOnInteraction: false }" 
      :loop="true"
      class="rounded-2xl overflow-hidden"
    >
      <swiper-slide v-for="(item, idx) in slideList" :key="idx" >
        <UiFlex class="w-full bg-gray-1000 overflow-hidden cursor-pointer" justify="center" style="aspect-ratio: 16 / 9" @click="viewImg(item)">
          <UiImg :src="item" class="h-full max-h-full" />
        </UiFlex>
      </swiper-slide>
    </swiper-container>

    <UModal v-model="open" fullscreen :ui="{
      fullscreen: 'w-auto h-auto max-w-full max-h-[100vh]'
    }">
      <UiFlex justify="center" class="w-full h-full">
        <img :src="imgSelect" class="max-h-[90vh] w-auto object-contain"/>
      </UiFlex>

      <UiFlex class="absolute top-2 right-2">
        <UButton color="black" size="xs" icon="i-bx-x" @click="open = false"></UButton>
      </UiFlex>
    </UModal>
  </ClientOnly>
</template>

<script setup>
const props = defineProps(['review', 'banner'])

const open = ref(false)
const imgSelect = ref(false)

const viewImg = (src) => {
  imgSelect.value = src
  open.value = true
}

const slideList = computed(() => {
  if(!props.review && !props.banner) return ['/images/null.webp']

  if(!props.review || props.review.length == 0) {
    const list = []
    list.push(props.banner || '/images/null.webp')
    return list
  }

  return props.review
})
</script>