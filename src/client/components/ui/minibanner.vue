<template>
  <UiFlex type="col" justify="center" class="MiniBanner rounded-2xl py-8 mb-4">
    <UiFlex class="gap-4 w-full">
      <UiImg 
        :src="!!type ? `/images/banner/${type}.png` : img" 
        class="
          bounce-anim 
          md:w-[80px] md:min-w-[80px] md:max-w-[80px]
          w-[50px] min-w-[50px] max-w-[50px]
          md:h-[80px] md:min-h-[80px] md:max-h-[80px]
          h-[50px] min-h-[50px] max-h-[50px]
        "
        v-if="!!type || !!img"
      />
      <div>
        <UiText weight="bold" class="text-xl md:text-3xl">{{ title }}</UiText>
        <UiText color="gray" class="text-sm md:text-lg" v-if="!!sub">{{ sub }}</UiText>
        <slot name="sub"></slot>
      </div>
    </UiFlex>

    <slot></slot>

    <div>
      <div class="MiniBanner__Star" :style="{ top: '30%', right: '30%', animationDuration: '1s', opacity: '0.5' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '40%', right: '10%', animationDuration: '0.8s', opacity: '0.1' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '15%', right: '20%', animationDuration: '0.5s', opacity: '0.7' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '60%', right: '40%', animationDuration: '1s', opacity: '0.2' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '85%', right: '50%', animationDuration: '0.8s', opacity: '0.9' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '20%', right: '60%', animationDuration: '0.9s', opacity: '0.3' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '80%', right: '70%', animationDuration: '1.5s', opacity: '0.6' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '70%', right: '80%', animationDuration: '0.9s', opacity: '0.8' }"></div>
      <div class="MiniBanner__Star" :style="{ top: '15%', right: '90%', animationDuration: '0.7s', opacity: '0.4' }"></div>
    </div>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['title', 'sub', 'type', 'img'])
</script>

<style lang="sass">
.MiniBanner
  position: relative
  background: radial-gradient(circle at 62% 70%, rgba(0, 0, 0, 0.12), rgb(9, 18, 27) 60%), linear-gradient(to right, #000000 0%, rgba(var(--color-primary-900)) 60%, #000000 100%)
  &__Star
    position: absolute
    width: 2px
    height: 2px
    background: white
    border-radius: 50%
    animation: minibanner-star 2s infinite

@keyframes minibanner-star
  0%, 100%
    opacity: 0.3
    transform: scale(1)
  50%
    opacity: 1
    transform: scale(1.5)
</style>