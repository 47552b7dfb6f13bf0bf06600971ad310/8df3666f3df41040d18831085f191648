<template>
  <UAccordion 
    :items="navItems" 
    :ui="{
      'item': { padding: 'pt-0 pb-2 pl-6' },
    }"
    multiple
  >
    <template #default="{item, open}">
      <UiFlex items="center" class="py-2 mb-2 cursor-pointer overflow-hidden select-none">
        <UiIcon :name="item.icon" size="5" :color="open ? 'primary' : 'gray'"/>
        <UiText 
          class="mx-4" 
          size="sm" 
          weight="semibold" 
          :color="open ? 'primary' : 'gray'"
          :text="item.label"
        />
        <UiIcon
          name="i-bx-chevron-right"
          size="5"
          :color="open ? 'primary' : 'gray'"
          class="ms-auto transform transition-transform duration-200"
          :class="[open && 'rotate-90']"
        />
      </UiFlex>
    </template>
    <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emit('to')"/></template>
    <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emit('to')"/></template>
    <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emit('to')"/></template>
    <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emit('to')"/></template>
    <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emit('to')"/></template>
    <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emit('to')"/></template>
    <template #tab-6><UVerticalNavigation :links="navItems[6].children" @click="emit('to')"/></template>
    <template #tab-7><UVerticalNavigation :links="navItems[7].children" @click="emit('to')"/></template>
    <template #tab-8><UVerticalNavigation :links="navItems[8].children" @click="emit('to')"/></template>
    <template #tab-9><UVerticalNavigation :links="navItems[9].children" @click="emit('to')"/></template>
    <template #tab-10><UVerticalNavigation :links="navItems[10].children" @click="emit('to')"/></template>
    <template #tab-11><UVerticalNavigation :links="navItems[11].children" @click="emit('to')"/></template>
    <template #tab-12><UVerticalNavigation :links="navItems[12].children" @click="emit('to')"/></template>
  </UAccordion>
</template>

<script setup>
const emit = defineEmits(['to'])
const navItems = [
  {
    label: 'Quản lý',
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: 'Chi tiêu', to: '/manage/@eni/spend' },
      { label: 'Nhật ký', to: '/manage/@eni/log' }
    ]
  },
  {
    label: 'Cài đặt',
    icon: 'i-bx-cog',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      { label: 'Thông tin trang', to: '/manage/@eni/config/page' },
      { label: 'API Mạng xã hội', to: '/manage/@eni/config/apisocial' },
      { label: 'Giá VIP và NDT', to: '/manage/@eni/config/price' },
      { label: 'Khuyễn mãi', to: '/manage/@eni/config/promo' },
      { label: 'Quyền hạn QTV', to: '/manage/@eni/config/permission' },
      { label: 'Bảo mật hệ thống', to: '/manage/@eni/config/security' },
    ]
  },
  {
    label: 'Tài khoản',
    icon: 'i-bxs-user',
    defaultOpen: false,
    slot: 'tab-2',
    children: [
      { label: 'Danh sách', to: '/manage/@eni/user' },
      { label: 'Cấp độ', to: '/manage/@eni/user/level' },
      { label: 'Trang bị', to: '/manage/@eni/user/equip' },
    ]
  },
  {
    label: 'Quảng cáo',
    icon: 'i-bx-spreadsheet',
    defaultOpen: false,
    slot: 'tab-3',
    children: [
      { label: 'Từ nguồn', to: '/manage/@eni/ads/from' },
    ]
  },
  {
    label: 'Bài viết',
    icon: 'i-bxs-book',
    defaultOpen: false,
    slot: 'tab-4',
    children: [
      { label: 'Khuyến mãi', to: '/manage/@eni/config/article/promotion' },
      { label: 'Trang giới thiệu', to: '/manage/@eni/config/article/about' },
      { label: 'Quyền riêng tư', to: '/manage/@eni/config/article/privacy' },
      { label: 'Điều khoản dịch vụ', to: '/manage/@eni/config/article/terms' },
      { label: 'Nạp game China', to: '/manage/@eni/config/article/china/payment' },
      { label: 'Căn cước game China', to: '/manage/@eni/config/article/china/passport' },
    ]
  },
  {
    label: 'IP & Thiết bị',
    icon: 'i-bxs-barcode',
    defaultOpen: false,
    slot: 'tab-5',
    children: [
      { label: 'White List', to: '/manage/@eni/ip-device/whitelist' },
      { label: 'User IP', to: '/manage/@eni/ip-device/user-ip' },
      { label: 'User Device', to: '/manage/@eni/ip-device/user-device' },
    ]
  },
  {
    label: 'Tin tức',
    icon: 'i-bx-news',
    defaultOpen: false,
    slot: 'tab-6',
    children: [
    { label: 'Danh mục', to: '/manage/@eni/news/category' }, 
    { label: 'Danh sách', to: '/manage/@eni/news' }, 
    ]
  },
  {
    label: 'Thanh toán',
    icon: 'i-bx-credit-card',
    defaultOpen: false,
    slot: 'tab-7',
    children: [
      { label: 'Kênh nạp', to: '/manage/@eni/gate' }, 
      { label: 'Nạp xu', to: '/manage/@eni/payment/coin' },
      // { label: 'Nạp tệ', to: '/manage/@eni/payment/yuan' },
    ]
  },
  {
    label: 'Trò chơi',
    icon: 'i-bxs-cube-alt',
    defaultOpen: false,
    slot: 'tab-8',
    children: [
      { label: 'Nền tảng', to: '/manage/@eni/game/platform' },
      { label: 'Thể loại', to: '/manage/@eni/game/category' },  
      { label: 'Game Private', to: '/manage/@eni/game/private' },
      { label: 'Game Tool', to: '/manage/@eni/game/tool' },
      // { label: 'Game China', to: '/manage/@eni/game/china' },
    ]
  },
  {
    label: 'Voucher',
    icon: 'i-mdi-voucher-outline',
    defaultOpen: false,
    slot: 'tab-9',
    children: [
      { label: 'Danh sách', to: '/manage/@eni/voucher' },
      { label: 'Lịch sử', to: '/manage/@eni/voucher/history' },
    ]
  },
  {
    label: 'Diễn đàn',
    icon: 'i-bx-layer',
    defaultOpen: false,
    slot: 'tab-10',
    children: [
      { label: 'Danh mục', to: '/manage/@eni/forum/category' },
      { label: 'Bài viết', to: '/manage/@eni/forum/post' },
    ]
  },
  {
    label: 'Nhiệm vụ',
    icon: 'i-material-symbols-light-other-admission',
    defaultOpen: false,
    slot: 'tab-11',
    children: [
      { label: 'Danh sách', to: '/manage/@eni/mission' },
      { label: 'Lịch sử', to: '/manage/@eni/mission/history' },
    ]
  },
  {
    label: 'Cộng tác viên',
    icon: 'i-bxs-user-badge',
    defaultOpen: false,
    slot: 'tab-12',
    children: [
      { label: 'Cấp độ', to: '/manage/@eni/collab/level' },
      { label: 'Danh sách', to: '/manage/@eni/collab' },
      { label: 'Thông báo', to: '/manage/@eni/collab/notify' },
      { label: 'Rút tiền', to: '/manage/@eni/collab/withdraw' },
    ]
  },
]
</script>