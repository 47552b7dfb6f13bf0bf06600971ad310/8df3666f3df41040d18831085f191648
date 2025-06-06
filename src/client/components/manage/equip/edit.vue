<template>
  <UiContent title="Chỉnh Sửa" :sub="`Trình chỉnh sửa trang bị ${modelValue.name}`" class="bg-gray rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UTabs :items="[ { label: 'Cơ bản', slot: 'basic' }, { label: 'Hoạt ảnh', slot: 'anim' }]">
      <template #basic>
        <UFormGroup label="Tên trang bị">
          <UInput v-model="state.name" />
        </UFormGroup>

        <UFormGroup label="Mô tả">
          <UInput v-model="state.description" />
        </UFormGroup>

        <UFormGroup label="Loại">
          <USelectMenu v-model="state.type" value-attribute="value" size="lg" :options="[
            { label: 'Danh hiệu', value: 'title'},
            { label: 'Trang phục', value: 'body'},
            { label: 'Cánh', value: 'wing'},
            { label: 'Vũ khí', value: 'weapon'},
            { label: 'Thú cưng', value: 'pet'},
            { label: 'Pháp trận', value: 'circle'},
          ]"/>
        </UFormGroup>

        <UFormGroup label="Giới tính">
          <USelectMenu v-model="state.sex" value-attribute="value" size="lg" :options="[
            { label: 'Tất cả', value: 0},
            { label: 'Nam', value: 1},
            { label: 'Nữ', value: 2}
          ]" placeholder="Tất cả" />
        </UFormGroup>

        <UFormGroup label="Mã Res">
          <UInput v-model="state.res" type="number" />
        </UFormGroup>

        <UFormGroup label="Lực chiến">
          <UInput v-model="state.power" type="number" />
        </UFormGroup>

        <UFormGroup label="Giá mua">
          <UInput v-model="state.price" type="number" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="state.display" />
        </UFormGroup>
      </template>

      <template #anim>
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-6">
            <UiText size="sm" color="gray" class="mb-2">Hoạt ảnh thông tin</UiText>

            <DataCharacterView id="CanvasInfo" class="bg-gray rounded-2xl border-1 border-gray mb-2" :source="sourceInfo" view="info" />

            <UFormGroup :label="`Offset X (${state.offset.info.x})`">
              <URange :min="-1000" :max="1000" v-model="state.offset.info.x" />
            </UFormGroup>
            <UFormGroup :label="`Offset Y (${state.offset.info.y})`">
              <URange :min="-1000" :max="1000" v-model="state.offset.info.y" />
            </UFormGroup>
            <UFormGroup :label="`Scale (${state.offset.info.scale['$numberDecimal']})`">
              <URange :min="0.1" :max="3.5" v-model="state.offset.info.scale['$numberDecimal']" :step="0.1" />
            </UFormGroup>
          </div>

          <div class="col-span-6">
            <UiFlex justify="between">
              <UiText size="sm" color="gray" class="mb-2">Hoạt ảnh hiển thị</UiText>
              <UToggle v-model="simulation" />
            </UiFlex>

            <DataCharacterView class="bg-gray rounded-2xl border-1 border-gray mb-2" :source="sourceIdle" view="idle" />

            <UFormGroup :label="`Offset X (${state.offset.idle.x})`">
              <URange :min="-1000" :max="1000" v-model="state.offset.idle.x" />
            </UFormGroup>
            <UFormGroup :label="`Offset Y (${state.offset.idle.y})`">
              <URange :min="-1000" :max="1000" v-model="state.offset.idle.y" />
            </UFormGroup>
            <UFormGroup :label="`Scale (${state.offset.idle.scale['$numberDecimal']})`" >
              <URange :min="0.1" :max="3.5" v-model="state.offset.idle.scale['$numberDecimal']" :step="0.1" />
            </UFormGroup>
          </div>
        </div>
      </template>
    </UTabs>

    <UiFlex class="mt-4">
      <!-- <UButton class="mr-auto" color="green" @click="createItemImage">Tạo ảnh</UButton> -->
      <UButton type="submit" @click="save" class="ml-auto">Lưu</UButton>
      <UButton color="gray" @click="emits('close')" class="ml-1">Đóng</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emits = defineEmits(['close', 'save'])
const simulation = ref(true)

const state = ref(JSON.parse(JSON.stringify(props.modelValue)))

const sourceIdle = computed(() => {
  const type = state.value.type
  const result = {}
  result[type] = state.value

  if(!!simulation.value && type != 'body') result['body'] = {
    "name": "101101", "type": "body", "res": "101101",
    "offset": {
      "info": { "x": 0, "y": 230, "scale": { $numberDecimal: 1.2 } },
      "idle": { "x": 0, "y": 220, "scale": { $numberDecimal: 1 } }
    }
  }
  
  return result 
})

const sourceInfo = computed(() => {
  const type = state.value.type
  const result = {}
  result[type] = state.value
  return result 
})

const createItemImage = () => {
  const canvas = document.getElementById('CanvasInfo')

  canvas.toBlob(async (blob) => {
    try {
      const formData = new FormData()
      formData.append('image', blob, `${state.value.type}-${state.value.res}.png`)

      const response = await fetch('/api/equip/manage/image/item', {
        method: 'POST',
        body: formData
      })
      const responseJSON = await response.json()
      if(responseJSON.code != 200) throw responseJSON.message

      emits('close')
    }
    catch(e){
      useNotify().error(err.toString())
    }
  })
}

const save = () => emits('save', state.value)
</script>