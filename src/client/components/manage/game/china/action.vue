<template>
  <div>
    <UDropdown :items="actions(props.game)">
      <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
    </UDropdown>

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Nền tảng">
          <SelectGamePlatform v-model="stateEditInfo.platform" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Danh mục">
          <SelectGameCategory v-model="stateEditInfo.category" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Tên">
          <UInput v-model="stateEditInfo.name" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Mã dự án">
          <UInput v-model="stateEditInfo.code" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UFormGroup label="Mô tả ngắn">
          <UInput v-model="stateEditInfo.description" />
        </UFormGroup>

        <UFormGroup label="Tỷ lệ nạp">
          <UInput v-model="stateEditInfo.rate.pay" type="number" />
        </UFormGroup>

        <UFormGroup label="Hiển thị">
          <SelectDisplay v-model="stateEditInfo.display" :disabled="!authStore.isAdmin" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <SelectPin v-model="stateEditInfo.pin" class="mr-auto" :disabled="!authStore.isAdmin" />
          
          <UButton type="submit" color="yellow" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editInfo = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Manager -->
    <UModal v-model="modal.editManager" preventClose>
      <UiContent title="Người Quản Lý" sub="Chỉnh sửa người quản lý trò chơi này" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.editManager = false"></UButton>
        </template>

        <UForm :state="stateEditManager" @submit="editManagerAction" >
          <UFormGroup>
            <SelectUsers v-model="stateEditManager.manager" :type="1" />
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" color="yellow" :loading="loading.edit">Sửa</UButton>
            <UButton color="gray" @click="modal.editManager = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>

    <!-- Modal Edit Image -->
    <UModal v-model="modal.editImage" preventClose>
      <UForm :state="stateEditImage" @submit="editImageAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Banner (16:9)">
          <UiUploadImage v-model="stateEditImage.banner">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEditImage.banner" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup label="Logo (1:1)">
          <UiUploadImage v-model="stateEditImage.logo">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEditImage.logo" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup label="Icon (1:1)">
          <UiUploadImage v-model="stateEditImage.icon">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEditImage.icon" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup label="Reviews">
          <UiUploadImages v-model="stateEditImage.review"></UiUploadImages>
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" color="yellow" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editImage = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Play -->
    <UModal v-model="modal.editPlay" preventClose>
      <UForm :state="stateEditPlay" @submit="editPlayAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Link chơi Web">
          <UInput v-model="stateEditPlay.web" />
        </UFormGroup>

        <UFormGroup label="Linh Tải Android">
          <UInput v-model="stateEditPlay.android" />
        </UFormGroup>

        <UFormGroup label="Linh Tải IOS">
          <UInput v-model="stateEditPlay.ios" />
        </UFormGroup>

        <UFormGroup label="Linh Tải Windows">
          <UInput v-model="stateEditPlay.windows" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton type="submit" color="yellow" :loading="loading.edit">Sửa</UButton>
          <UButton color="gray" @click="modal.editPlay = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Content -->
    <UModal v-model="modal.editContent" preventClose :ui="{width: 'sm:max-w-[calc(90%)] md:max-w-[calc(80%)] lg:max-w-4xl'}">
      <UiContent title="Bài Giới Thiệu" sub="Chỉnh sửa bài viết mô tả trò chơi" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.editContent = false"></UButton>
        </template>

        <UForm :state="stateEditContent" @submit="editContentAction">
          <UiEditor class="bg-gray" v-model="stateEditContent.content"></UiEditor>
          <UiFlex justify="end" class="mt-4">
            <UButton type="submit" color="yellow" :loading="loading.edit">Lưu</UButton>
            <UButton color="gray" @click="modal.editContent = false" :disabled="loading.edit" class="ml-1">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>

    <!--Modal Reset-->
    <UModal v-model="modal.reset" preventClose>
      <UiContent title="Reset trò chơi" class="bg-card rounded-2xl p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="orange" variant="soft">
          <template #description>
            Bạn chắc chắn muốn reset trò chơi này ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="resetAction" :loading="loading.reset" color="orange">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.reset = false" :disabled="loading.reset" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <!--Modal Del-->
    <UModal v-model="modal.del" preventClose>
      <UiContent title="Xóa trò chơi" class="bg-card rounded-2xl p-4" no-dot>
        <UAlert title="Chú Ý" icon="i-bxs-info-circle" color="red" variant="soft">
          <template #description>
            Bạn chắc chắn muốn xóa trò chơi <b>[{{ stateDel.code }}] {{ stateDel.name }}</b> khỏi hệ thống ?
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="delAction" :loading="loading.del" color="red">Xác Nhận</UButton>
          <UButton color="gray" @click="modal.del = false" :disabled="loading.del" class="ml-1">Đóng</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const props = defineProps(['game'])
const emits = defineEmits(['update'])
const route = useRoute()

// State
const stateEditInfo = ref({
  _id: null,
  platform: null,
  category: null,
  name: null,
  code: null,
  description: null,
  rate: {
    pay: null,
  },
  pin: null,
  display: null,
})
const stateEditImage = ref({
  _id: null,
  banner: null,
  logo: null,
  icon: null,
  review: null,
})
const stateEditPlay = ref({
  _id: null,
  web: null,
  windows: null,
  android: null,
  ios: null,
})
const stateEditContent = ref({
  _id: null,
  content: null
})
const stateEditManager = ref({
  _id: null,
  manager: null
})
const stateDel = ref({
  _id: null,
  name: null,
  code: null
})
const stateReset = ref({
  _id: null
})

// Modal
const modal = ref({
  editInfo: false,
  editImage: false,
  editPlay: false,
  editContent: false,
  editManager: false,
  del: false,
  reset: false
})

// Loading
const loading = ref({
  edit: false,
  del: false,
  reset: false
})

// Action Menu
const actions = (row) => [
  [{
    label: 'Quản lý',
    icon: 'i-bx-server',
    disabled: !!route.params._id,
    click: () => useTo().openNewTab(`/manage/@gm/china/${row._id}`)
  }],
  [{
    label: 'Sửa người quản lý',
    icon: 'i-bx-group',
    disabled: !!route.params._id,
    click: () => {
      Object.keys(stateEditManager.value).forEach(key => stateEditManager.value[key] = row[key])
      modal.value.editManager = true
    }
  }],
  [{
    label: 'Sửa thông tin',
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditInfo.value).forEach(key => stateEditInfo.value[key] = row[key])
      stateEditInfo.value.category = row.category._id
      stateEditInfo.value.platform = row.platform._id
      modal.value.editInfo = true
    }
  },{
    label: 'Sửa hình ảnh',
    icon: 'i-bx-image-add',
    click: () => {
      Object.keys(stateEditImage.value).forEach(key => stateEditImage.value[key] = row.image[key])
      stateEditImage.value._id = row._id
      modal.value.editImage = true
    }
  },{
    label: 'Sửa bài giới thiệu',
    icon: 'i-bxs-book-content',
    click: async () => {
      try {
        const content = await useAPI('game/china/manage/project/get/content', { _id: row._id })
        stateEditContent.value._id = row._id
        stateEditContent.value.content = content
        modal.value.editContent = true
      }
      catch (e) {
        return
      }
    }
  },{
    label: 'Sửa link chơi',
    icon: 'i-bx-link',
    click: () => {
      Object.keys(stateEditPlay.value).forEach(key => stateEditPlay.value[key] = row.play[key])
      stateEditPlay.value._id = row._id
      modal.value.editPlay = true
    }
  }],[{
    label: 'Reset trò chơi',
    icon: 'i-bx-reset',
    click: () => {
      Object.keys(stateReset.value).forEach(key => stateReset.value[key] = row[key])
      stateReset.value._id = row._id
      modal.value.reset = true
    }
  },{
    label: 'Xóa trò chơi',
    icon: 'i-bx-trash',
    disabled: true,
    click: () => {
      Object.keys(stateDel.value).forEach(key => stateDel.value[key] = row[key])
      stateDel.value._id = row._id
      modal.value.del = true
    }
  }]
]

// Action
const editInfoAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/china/manage/project/edit/info', JSON.parse(JSON.stringify(stateEditInfo.value)))

    loading.value.edit = false
    modal.value.editInfo = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editImageAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/china/manage/project/edit/image', JSON.parse(JSON.stringify(stateEditImage.value)))

    loading.value.edit = false
    modal.value.editImage = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editPlayAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/china/manage/project/edit/play', JSON.parse(JSON.stringify(stateEditPlay.value)))

    loading.value.edit = false
    modal.value.editPlay = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editContentAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('game/china/manage/project/edit/content', JSON.parse(JSON.stringify(stateEditContent.value)))

    loading.value.edit = false
    modal.value.editContent = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const editManagerAction = async () => {
  try {
    loading.value.edit = true

    const clone = JSON.parse(JSON.stringify(stateEditManager.value))
    clone.manager = clone.manager.map(i => i._id)
    await useAPI('game/china/manage/project/edit/manager', clone)

    loading.value.edit = false
    modal.value.editManager = false
    emits('update')
  }
  catch (e) {
    loading.value.edit = false
  }
}

const resetAction = async (_id) => {
  try {
    loading.value.reset = true
    await useAPI('game/china/manage/project/reset', JSON.parse(JSON.stringify(stateReset.value)))

    loading.value.reset = false
    modal.value.reset = false
    emits('update')
  }
  catch (e) {
    loading.value.reset = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('game/china/manage/project/del', JSON.parse(JSON.stringify(stateDel.value)))

    loading.value.del = false
    modal.value.del = false
    emits('update')
  }
  catch (e) {
    loading.value.del = false
  }
}
</script>