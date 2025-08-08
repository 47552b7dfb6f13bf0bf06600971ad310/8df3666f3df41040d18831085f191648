<template>
  <div>
    <SelectGameOs v-model="os" class="mb-2" />

    <DataGameToolPlayed :user="user" :collab="collab" v-if="os == 'tool'" />
    <DataGamePrivatePlayed :user="user" :collab="collab" v-if="os == 'private'" />
    <DataGameChinaPlayed :user="user" :collab="collab" v-if="os == 'china'" />
  </div>
</template>

<script setup>
const props = defineProps(['user','btnClose','collab'])
const emits = defineEmits(['close'])
const os = ref('private')
</script>