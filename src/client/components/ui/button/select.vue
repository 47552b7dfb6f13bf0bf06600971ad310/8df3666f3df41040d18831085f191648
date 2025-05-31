<template>
  <UiFlex 
    justify="center" 
    class="
      UiButtonSelect 
      relative inline-flex cursor-pointer
      rounded-2xl
      before:content-[''] before:absolute before:inset-[1px] before:rounded-2xl before:pointer-events-none before:z-0
    "
    :class="{
      'UiButtonSelect--active': !!active
    }"
  >
    <div class="absolute left-0 top-0 h-full w-full pointer-events-none">
      <div class="UiButtonSelect__Top w-[70%] h-[4px] mx-auto rounded-b-2xl"></div>
    </div>

    <UiFlex justify="center z-[1] UiButtonSelect__Content">
      <slot></slot>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  active: { type: Boolean, default: false }
})
</script>

<style lang="sass">
.UiButtonSelect
  background-image: linear-gradient(180deg, #90949a, #13171c00)
  transition: all 0.25s ease
  &::before
    background-image: radial-gradient(77.89% 100% at 50% 0%, #3d494f, #09121b 70.39%, #09121b)
  &__Top
    background: #90949a
    transition: all 0.1s ease
  &__Content
    transition: all 0.25s ease
    opacity: 0.5
  &--active, &:hover
    background-image: linear-gradient(180deg, rgba(var(--color-primary-500)), #13171c00)
    &::before
      background-image: radial-gradient(77.89% 100% at 50% 0%, rgba(var(--color-primary-900)), #09121b 70.39%, #09121b)
    .UiButtonSelect__Top
      background: rgba(var(--color-primary-500))
    .UiButtonSelect__Content
      opacity: 1
</style>