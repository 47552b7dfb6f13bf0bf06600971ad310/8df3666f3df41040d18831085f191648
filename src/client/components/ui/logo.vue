<template>
  <UiFlex class="select-none">
    <img :src="configStore.config.logo_image" :style="{ height: `${imgSize}px` }" v-if="!!configStore.config.logo_image" />
    
    <UiText weight="bold" size="2xl" color="primary" class="italic" v-else>
      {{nameArr.firstWord}}<span class="text-white text-base">{{nameArr.ensWord}}</span>
    </UiText>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const props = defineProps({
  imgSize: { type: [ Number, String ], default: 23 }
})

const nameArr = computed(() => {
  const sentence = configStore.config.name
  if(!sentence) return { firstWord: "ENI", ensWord: "Studio" }

  const words = sentence.split(" ")
  if(words.length === 1) return { firstWord: words[0], ensWord: "" }

  const firstWord = words[0]
  const filteredWords = words.filter(word => word !== firstWord)
  const ensWord = filteredWords.join("")
  return { firstWord, ensWord }
})
</script>