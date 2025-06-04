<template>
  <div>
    <UiMinibanner title="Kiếm Tiền" sub="Cùng chúng tôi kiếm thêm thu nhập" type="money" class="mb-4" />

    <UiContent title="ECoin" sub="Giới thiệu về tiền nền tảng" class="mb-8 mt-4" icon="i-streamline-coins-stack-solid">
      <UiFlex type="col" class="gap-1.5 pl-4 text-[#c3c3c3]" items="start">
        <span>- Đây là đơn vị tiền riêng biệt, không dùng chung với Xu.</span>
        <span>- Sử dụng ECoin để quy đổi thành hiện vật (tiền mặt).</span>
        <span>- ECoin chỉ kiếm được từ hoạt động chúng tôi giới thiệu dưới đây.</span>
      </UiFlex>
    </UiContent>

    <UiContent title="Hoạt Động" sub="Các hoạt động kiếm ECoin của chúng tôi" icon="i-tabler-activity" class="@container">
      <div class="grid grid-cols-12 @3xl:gap-4 gap-2">
        <NuxtLink to="/money/invite" class="@3xl:col-span-4 col-span-12" >
          <UiFlex class="color-yellow-light bg-box-light rounded-2xl p-6 gap-4 @3xl:flex-col">
            <UiImg :src="`/images/banner/invite.png`" w="1" h="1" img-size="500px" class="@3xl:min-w-[90%] @3xl:max-w-[90%] min-w-[30%] max-w-[30%] mx-auto" />

            <div class="grow z-[1]">
              <UiFlex type="col" class="mb-4" items="start">
                <UiText weight="bold" color="yellow" class="text-lg md:text-xl mb-1">
                  Mời Bạn
                </UiText>
                <UiText weight="semibold" class="text-sm md:text-base">
                  Giới thiệu bạn bè tham gia và cùng nhau kiếm thu nhập
                </UiText>
              </UiFlex>

              <UiFlex justify="center">
                <UButton color="gray" size="lg" class="grow justify-center bg-anim-light">XEM CHI TIẾT</UButton>
              </UiFlex>
            </div>
          </UiFlex>
        </NuxtLink>

        <NuxtLink to="/money/collab" class="@3xl:col-span-4 col-span-12">
          <UiFlex class="color-cyan-light bg-box-light rounded-2xl p-6 gap-4 @3xl:flex-col">
            <UiImg :src="`/images/banner/collab.png`" w="1" h="1" img-size="500px" class="@3xl:min-w-[90%] @3xl:max-w-[90%] min-w-[30%] max-w-[30%] mx-auto" />

            <div class="grow z-[1]">
              <UiFlex type="col" class="mb-4" items="start">
                <UiText weight="bold" color="cyan" class="text-lg md:text-xl mb-1" >
                  Cộng Tác Viên
                </UiText>
                <UiText weight="semibold" class="text-sm md:text-base">
                  Hợp tác với chúng tôi và cùng nhau phát triển nền tảng
                </UiText>
              </UiFlex>

              <UiFlex justify="center">
                <UButton color="gray" size="lg" class="grow justify-center bg-anim-light">XEM CHI TIẾT</UButton>
              </UiFlex>
            </div>
          </UiFlex>
        </NuxtLink>

        <div to="#" class="@3xl:col-span-4 col-span-12" @click="useNotify().error('Tính năng đang bảo trì, vui lòng đợi thông báo mới nhất')">
          <UiFlex class="color-purple-light bg-box-light rounded-2xl p-6 gap-4 @3xl:flex-col">
            <UiImg :src="`/images/banner/affiliate.png`" w="1" h="1" img-size="500px" class="@3xl:min-w-[90%] @3xl:max-w-[90%] min-w-[30%] max-w-[30%] mx-auto" />

            <div class="grow z-[1]">
              <UiFlex type="col" class="mb-4" items="start">
                <UiText weight="bold" color="purple" class="text-lg md:text-xl mb-1">
                  Tiếp Thị Liên Kết
                </UiText>
                <UiText weight="semibold"class="text-sm md:text-base">
                  Chia sẻ nền tảng bằng liên kết kiếm tiền lên các MXH
                </UiText>
              </UiFlex>
            
              <UiFlex justify="center">
                <UButton color="gray" size="lg" class="grow justify-center bg-anim-light">XEM CHI TIẾT</UButton>
              </UiFlex>
            </div>
          </UiFlex>
        </div>
      </div>
    </UiContent>
  </div>
</template>

<script setup>
const configStore = useConfigStore()

useSeoMeta({
  title: () => `Kiếm Tiền - ${configStore.config.name}`,
  ogTitle: () => `Kiếm Tiền - ${configStore.config.name}`,
  description: () => `Kiếm thêm thu nhập hấp dẫn cùng nền tảng`,
  ogDescription: () => `Kiếm thêm thu nhập hấp dẫn cùng nền tảng`,
})
</script>