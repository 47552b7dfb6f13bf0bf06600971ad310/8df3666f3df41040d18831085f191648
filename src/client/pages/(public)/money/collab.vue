<template>
  <div>
    <UiMinibanner title="Cộng Tác Viên" sub="Hợp tác cùng chúng tôi và kiếm thêm thu nhập" type="collab" class="mb-4" />
    
    <UiContent title="Tổng Quan" sub="Giới thiệu về chương trình CTV" class="mb-8" icon="i-carbon-collaborate">
      <UiFlex type="col" class="gap-1.5 pl-4 text-[#c3c3c3]" items="start">
        <span>- Khi tham gia, bạn sẽ được cung cấp tên miền riêng.</span>
        <span>- Được cung cấp trình quản lý web riêng.</span>
        <span>- Và được tùy biến nội dung hiển thị trên trang web theo cá nhân.</span>
        <span>- Bạn sẽ được nhận phần trăm hoa hồng từ các hoạt động của người chơi.</span>
        <span>- Hoa hồng ở mỗi hoạt động là khác nhau, ngoài ra các cấp CTV sẽ có mức hoa hồng thêm theo từng cấp.</span>
      </UiFlex>
    </UiContent>

    <UiContent title="Hệ Thống CTV" sub="Các cấp độ kèm hoa hồng và mức giá tham gia" class="mb-8" icon="i-icon-park-outline-level">
      <DataCollabAboutLevel />
    </UiContent>

    <UiContent title="Tham Gia" sub="Để tham gia, vui lòng liên hệ với chúng tôi" icon="i-material-symbols-join-outline">
      <UiFlex type="col" class="gap-1.5 pl-4 text-[#c3c3c3]" items="start">
        <span>
          - 
          <DataCollabAboutSupport class="inline-flex">
            <template #default="{ open }">
              <UiText color="yellow" weight="bold" class="cursor-pointer" @click="open">Bấm vào đây</UiText>
            </template>
          </DataCollabAboutSupport>
          để liên hệ trực tiếp với chúng tôi.
        </span>
        <span>- Bạn sẽ được đội ngũ nhân viên chuyên nghiệp hướng dẫn tận tình.</span>
        <span>- Đảm bảo nguồn thu nhập hấp dẫn đến với bạn.</span>
        <span>- Rất vui được hợp tác với bạn và chúng ta cùng nhau phát triển.</span>
      </UiFlex>
    </UiContent>
  </div>
</template>

<script setup>
const configStore = useConfigStore()

useSeoMeta({
  title: () => `Cộng Tác Viên - ${configStore.config.name}`,
  ogTitle: () => `Cộng Tác Viên - ${configStore.config.name}`,
  description: () => `Hợp tác cùng chúng tôi và kiếm thêm thu nhập`,
  ogDescription: () => `Hợp tác cùng chúng tôi và kiếm thêm thu nhập`,
})
</script>