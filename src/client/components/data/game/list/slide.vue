<template>
  <ClientOnly>
    <swiper-container 
      ref="containerRef" 
      :slidesPerView="2" 
      :spaceBetween="12"
      :breakpoints="{
        '768': {
          slidesPerView: 3,
          spaceBetween: 12,
        },
        '1500': {
          slidesPerView: 4,
          spaceBetween: 12,
        },
      }"
      :autoplay="{ delay: 2500, disableOnInteraction: false }" 
      :loop="true"
      class="rounded-2xl overflow-hidden"
    >
      <swiper-slide v-for="(item, idx) in list" :key="idx" >
        <DataGameBox :game="item" :os="os" :no-statistic="noStatistic" />
      </swiper-slide>
    </swiper-container>
  </ClientOnly>
</template>

<script setup>
const props = defineProps(['list', 'os', 'noStatistic'])
</script>