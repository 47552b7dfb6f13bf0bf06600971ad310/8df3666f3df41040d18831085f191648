<template>
  <UiContent 
    title="Lucky Egg" 
    sub="Chỉnh sửa thông số đập trứng may mắn"
  >
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="mb-2" :class="{
          'bg-gray-1000' : !open,
          'color-blue-light bg-anim-light': !!open
        }">
          <UiText class="text-white">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #one>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup label="Giá đập">
              <UInput v-model="state.one.price" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng">
              <SelectGamePrivateItemListRate class="bg-gray" v-model="state.one.gift" :game="game.code" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #two>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup label="Giá đập">
              <UInput v-model="state.two.price" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng">
              <SelectGamePrivateItemListRate class="bg-gray" v-model="state.two.gift" :game="game.code" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #three>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup label="Giá đập">
              <UInput v-model="state.three.price" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng">
              <SelectGamePrivateItemListRate class="bg-gray" v-model="state.three.gift" :game="game.code" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #four>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup label="Giá đập">
              <UInput v-model="state.four.price" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng">
              <SelectGamePrivateItemListRate class="bg-gray" v-model="state.four.gift" :game="game.code" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #five>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup label="Giá đập">
              <UInput v-model="state.five.price" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng">
              <SelectGamePrivateItemListRate class="bg-gray" v-model="state.five.gift" :game="game.code" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #six>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup label="Giá đập">
              <UInput v-model="state.six.price" />
            </UFormGroup>

            <UFormGroup label="Phần thưởng">
              <SelectGamePrivateItemListRate class="bg-gray" v-model="state.six.gift" :game="game.code" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>
    </UAccordion>

    <UiFlex justify="end" class="gap-1">
      <UButton color="yellow" @click="update" :loading="loading.update">Cập nhật</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const game = useAttrs().game

const loading = ref({
  load: true,
  update: false
})

const menu = [
  { label: 'Hàng 1', slot: 'one' },
  { label: 'Hàng 2', slot: 'two' },
  { label: 'Hàng 3', slot: 'three' },
  { label: 'Hàng 4', slot: 'four' },
  { label: 'Hàng 5', slot: 'five' },
  { label: 'Hàng 6', slot: 'six' },
]

const state = ref({
  one: { price: null, gift: [] },
  two: { price: null, gift: [] },
  three: { price: null, gift: [] },
  four: { price: null, gift: [] },
  five: { price: null, gift: [] },
  six: { price: null, gift: [] },
  game: game._id
})

const update = async () => {
  try {
    loading.value = true

    state.value.game = game._id
    await useAPI('game/private/manage/egg/update', JSON.parse(JSON.stringify(state.value)))

    getConfig()
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}

const getConfig = async () => {
  const config = await useAPI('game/private/manage/egg/get', { game: game._id })
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>