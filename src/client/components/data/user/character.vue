<template>
  <div>
    <div v-if="!!character && character.sex > 0">
      <UiFlex class="relative gap-2">
        <DataCharacterPower :powers="characterPower" class="absolute top-0 left-0" />

        <UiFlex type="col" class="gap-4 absolute -left-4 z-0">
          <DataEquipUseItem class="relative left-4" :source="character.title?.use" :level="character.title?.level" :user="user" :power="characterPower['title']" type="title" @use="use" @buy="updatePower" @upgrade="upgrade" />
          <DataEquipUseItem class="relative" :source="character.body?.use" :level="character.body?.level" :user="user" :power="characterPower['body']" type="body" @use="use" @buy="updatePower" @upgrade="upgrade" />
          <DataEquipUseItem class="relative left-4" :source="character.weapon?.use" :level="character.weapon?.level" :user="user" :power="characterPower['weapon']" type="weapon" @use="use" @buy="updatePower" @upgrade="upgrade" />
        </UiFlex>

        <UiFlex class="grow z-[1]" style="aspect-ratio: 1 / 1; pointer-events: none; user-select: none;">
          <DataCharacterView w="620" h="620" :source="source" view="idle" v-if="!!source"/>
        </UiFlex>

        <UiFlex type="col" class="gap-4 absolute -right-4 z-0">
          <DataEquipUseItem class="relative right-4" :source="character.wing?.use" :level="character.wing?.level" :user="user" :power="characterPower['wing']" type="wing" @use="use" @buy="updatePower" @upgrade="upgrade" />
          <DataEquipUseItem class="relative":source="character.pet?.use" :level="character.pet?.level" :user="user" :power="characterPower['pet']" type="pet" @use="use" @buy="updatePower" @upgrade="upgrade" />
          <DataEquipUseItem class="relative right-4" :source="character.circle?.use" :level="character.circle?.level" :user="user" :power="characterPower['circle']" type="circle" @use="use" @buy="updatePower" @upgrade="upgrade" />
        </UiFlex>
      </UiFlex>
    </div>

    <DataCharacterSex v-if="!character || (!!character && character.sex == 0)" @done="sex" class="mb-4" />
  </div>
</template>

<script setup>
const props = defineProps(['character', 'powers', 'user'])
const emits = defineEmits(['sex', 'use', 'upgrade'])

const characterPower = ref(JSON.parse(JSON.stringify(props.powers)))

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

const updatePower = async () => {
  try {
    const data = await useAPI('user/public/character/power')
    characterPower.value = data
  }
  catch(e){
  }
}

const upgrade = async (data) => {
  await updatePower()
  emits('upgrade', data)
}
</script>