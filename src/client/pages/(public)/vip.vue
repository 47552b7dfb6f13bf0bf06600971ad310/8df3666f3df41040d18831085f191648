<template>
  <div class="max-w-[900px] mx-auto @container">
    <UiMinibanner title="Nâng VIP" sub="Nâng cấp tài khoản lên VIP" type="vip" class="mb-4" />

    <div class="grid grid-cols-12 gap-4">
      <UCard 
        class="
          @3xl:col-span-6 col-span-12 
          cursor-pointer select-none 
          overflow-hidden
        "
        :ui="{
          header: { background: `bg-vip-${item.type}` },
          divide: 'divide-y-0'
        }" 
        v-for="(item, index) in list" :key="index"
        @click="select(item)"
      >
        <template #header>
          <UiFlex justify="between">
            <UiImg :src="`/images/user/vip/${item.type}.webp`" class="w-[60px]" img-size="200px"/>

            <div>
              <UiText align="right" weight="bold" size="lg">{{  item.title }}</UiText>
              <UiText align="right" size="sm">{{ item.des }}</UiText>
            </div>
          </UiFlex>
        </template>

        <UiText align="center" weight="bold" :color="item.color" size="3xl" class="mt-6 mb-8">{{ useMoney().toMoney(item.price) }}</UiText>

        <UDivider class="mb-4" :ui="{ border: { base: 'border-gray-800' }}">VIP</UDivider>

        <UiFlex type="col" items="start" class="gap-1.5">
          <UiFlex v-for="(info, i) in item.info" :key="i" class="gap-2">
            <UiIcon name="i-bxs-star" size="4" />
            <UiText size="sm" color="gray" >{{ info }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>
    </div>

    <UModal v-model="modal" prevent-close>
      <UiContent title="Nâng VIP" sub="Đơn hàng mua VIP" no-dot class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" :disabled="!!loading" square @click="modal = false"></UButton>
        </template>

        <UForm ref="form">
          <UFormGroup label="Gói nâng cấp">
            <UInput :model-value="selectVip.title" readonly />
          </UFormGroup>

          <UFormGroup label="Giá Xu">
            <UInput :model-value="useMoney().toMoney(selectVip.price)" readonly />
          </UFormGroup>

          <UiFlex justify="end" class="mt-4">
            <UButton :loading="loading" :disabled="!!loading" @click="submit" color="yellow" size="md">Mua Ngay</UButton>
            <UButton :disabled="!!loading" @click="modal = false" color="gray" size="md">Đóng</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
useSeoMeta({
  title: () => `Nâng VIP - ${configStore.config.name}`,
  ogTitle: () => `Nâng VIP - ${configStore.config.name}`,
  description: () => 'Nâng cấp tài khoản lên VIP',
  ogDescription: () => 'Nâng cấp tài khoản lên VIP',
})

const authStore = useAuthStore()
const modal = ref(false)
const selectVip = ref(undefined)
const form = ref()
const loading = ref(false)

const list = ref([
  {
    title: 'VIP Tháng',
    des: 'Phí gia hạn 1 tháng',
    price: configStore.config.vip.month,
    info: [
      'Đặc quyền 30 ngày',
      'Huy hiệu VIP theo tên',
      'Giảm giá >=2% mua Game Tool',
      'Giảm giá >=2% cửa hàng Game Private',
      'Thông báo khi trực tuyến',
      'Trò chuyện thế giới không giới hạn',
    ],
    type: 'month',
    color: 'sky'
  },
  {
    title: 'VIP Trọn Đời',
    des: 'Không cần kích hoạt lại',
    price: configStore.config.vip.forever,
    info: [
      'Đặc quyền trọn đời',
      'Huy hiệu VIP theo tên',
      'Miễn phí mua Game Tool',
      'Giảm giá >=10% cửa hàng Game Private',
      'Thông báo khi trực tuyến',
      'Trò chuyện thế giới không giới hạn',
    ],
    type: 'forever',
    color: 'purple'
  }
])

const select = (vip) => {
  if(!authStore.isLogin) return useNotify().error('Vui lòng đăng nhập trước')
  selectVip.value = vip
  modal.value = true
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('user/public/vip/update', JSON.parse(JSON.stringify(selectVip.value)))

    loading.value = false
    modal.value = false
    await authStore.setAuth()
  }
  catch (e) {
    loading.value = false
  }
}
</script>