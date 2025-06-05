<template>
  <div>
    <div v-if="!!character && character.sex > 0">
      <UiFlex class="relative gap-2">
        <UiFlex type="col" class="gap-4 absolute -left-4 z-0">
          <DataEquipUseItem class="relative left-4" :source="character.title?.use" :level="character.title?.level" :user="user" type="title" @use="use" />
          <DataEquipUseItem class="relative" :source="character.body?.use" :level="character.body?.level" :user="user" type="body" @use="use" />
          <DataEquipUseItem class="relative left-4" :source="character.weapon?.use" :level="character.weapon?.level" :user="user" type="weapon" @use="use" />
        </UiFlex>

        <UiFlex class="grow z-[1]" style="aspect-ratio: 1 / 1; pointer-events: none; user-select: none;">
          <DataCharacterView class="" :source="source" view="idle" v-if="!!source"/>
        </UiFlex>

        <UiFlex type="col" class="gap-4 absolute -right-4 z-0">
          <DataEquipUseItem class="relative right-4" :source="character.wing?.use" :level="character.wing?.level" :user="user" type="wing" @use="use" />
          <DataEquipUseItem class="relative":source="character.pet?.use" :level="character.pet?.level" :user="user" type="pet" @use="use" />
          <DataEquipUseItem class="relative right-4" :source="character.circle?.use" :level="character.circle?.level" :user="user" type="circle" @use="use" />
        </UiFlex>
      </UiFlex>
    </div>

    <DataCharacterSex v-if="!character || (!!character && character.sex == 0)" @done="sex" />
  </div>
</template>

<script setup>
const props = defineProps(['character', 'user'])
const emits = defineEmits(['sex', 'use'])

const source = computed(() => {
  if(!props.character) return null

  const data = {}

  for (const [type, value] of Object.entries(props.character)) {
    if(!!value.use) data[type] = value.use
  }
  
  return Object.entries(data).length > 0 ? data : null
})

const use = (data) => emits('use', data)
const sex = () => emits('sex')
</script>