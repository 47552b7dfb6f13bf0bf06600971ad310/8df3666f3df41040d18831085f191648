<template>
  <div class="mt-4">
    <UiContent title="Mời Bạn Tham Gia" sub="Giới thiệu về chương trình mời bạn" class="mb-8" icon="i-la-user-friends">
      <UiFlex type="col" class="gap-1.5 pl-4 text-[#c3c3c3]" items="start">
        <span>- Bạn sẽ được cung cấp 1 mã mời riêng biệt kèm đường dẫn chia sẻ.</span>
        <span>- Sử dụng đường dẫn hệ thống cung cấp để chia sẻ cho bạn bè.</span>
        <span>- Khi bạn bè đăng ký tài khoản bằng đường dẫn bạn cung cấp, hệ thống sẽ tính là bạn mời được 1 người bạn.</span>
        <span>- Khi bạn bè bạn mời tham gia đạt được những điều kiện nhất định, bạn sẽ nhận được ECoin tương ứng theo cấp độ của bạn.</span>
        <span>- Nếu bạn bè nạp Xu, bạn sẽ nhận được ECoin từ phần trăm chiết khấu theo cấp độ của bạn.</span>
      </UiFlex>
    </UiContent>

    <UiContent title="Hệ Thống Thưởng" sub="Các cấp độ tài khoản kèm mức thưởng" icon="i-icon-park-outline-level">
      <DataInviteAboutLevel />
    </UiContent>
  </div>
</template>