<template>
  <UiContent 
    title="Config Permission" 
    sub="Chỉnh sửa quyền hạn quản trị viên" 
    class="max-w-3xl mx-auto"
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

      <template #statistic>
        <UCard>
          <UiFlex justify="between" class="gap-1">
            <UiText color="gray" size="sm">Xem thông tin</UiText>
            <SelectPermission v-model="state.statistic" />
          </UiFlex>
        </UCard>
      </template>

      <template #log>
        <UCard>
          <UiFlex justify="between" class="gap-1">
            <UiText color="gray" size="sm">Xem thông tin</UiText>
            <SelectPermission v-model="state.log" />
          </UiFlex>
        </UCard>
      </template>

      <template #config>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Cấu hình</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.config.get" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.config.edit" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Bài viết</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.config.article.get" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.config.article.edit" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #spend>
        <UCard>
          <UiFlex type="col" class="gap-1">
            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.spend.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.spend.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.spend.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.spend.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #user>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Tài khoản</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.user.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa thông tin</UiText>
              <SelectPermission v-model="state.user.edit.profile" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa tiền tệ</UiText>
              <SelectPermission v-model="state.user.edit.currency" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Cấp độ</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.user.level.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.user.level.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.user.level.edit" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #equip>
        <UCard>
          <UiFlex type="col" class="gap-1">
            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.equip.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.equip.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.equip.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.equip.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #ads>
        <UCard>
          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Từ nguồn</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.ads.from.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.ads.from.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.ads.from.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.ads.from.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #ip-device>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">WhiteList</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.ip.whitelist.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thao tác</UiText>
              <SelectPermission v-model="state.ip.whitelist.action" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Địa chỉ IP</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.ip.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thao tác</UiText>
              <SelectPermission v-model="state.ip.action" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Thiết bị</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.device.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thao tác</UiText>
              <SelectPermission v-model="state.device.action" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #news>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Danh mục</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.news.category.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.news.category.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.news.category.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.news.category.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Tin tức</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.news.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.news.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.news.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.news.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #gate>
        <UCard>
          <UiFlex type="col" class="gap-1">
            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.gate.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.gate.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.gate.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.gate.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #payment>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Nạp xu</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.payment.coin.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Duyệt</UiText>
              <SelectPermission v-model="state.payment.coin.action" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Nạp tệ</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.payment.yuan.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Duyệt</UiText>
              <SelectPermission v-model="state.payment.yuan.action" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #game>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Nền tảng</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.game.platform.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.game.platform.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.game.platform.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.game.platform.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Danh mục</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.game.category.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.game.category.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.game.category.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.game.category.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Game Private</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.game.private.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.game.private.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.game.private.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.game.private.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Game Tool</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.game.tool.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.game.tool.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.game.tool.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.game.tool.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Game China</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.game.china.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.game.china.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.game.china.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.game.china.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #voucher>
        <UCard>
          <UiFlex type="col" class="gap-1">
            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.voucher.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.voucher.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.voucher.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.voucher.del" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Lịch sử</UiText>
              <SelectPermission v-model="state.voucher.history.list" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #mission>
        <UCard>
          <UiFlex type="col" class="gap-1">
            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.mission.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.mission.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.mission.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.mission.del" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Lịch sử</UiText>
              <SelectPermission v-model="state.mission.history.list" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #forum>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Danh mục</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.forum.category.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.forum.category.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.forum.category.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.forum.category.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Bài viết</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.forum.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.forum.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.forum.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #collab>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Cấp độ</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.collab.level.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.collab.level.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.collab.level.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.collab.level.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Thông báo</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.collab.notify.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.collab.notify.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.collab.notify.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.collab.notify.del" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Rút tiền</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.collab.withdraw.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Duyệt</UiText>
              <SelectPermission v-model="state.collab.withdraw.action" />
            </UiFlex>
          </UiFlex>

          <UiFlex type="col" class="gap-1">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Cộng tác viên</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.collab.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.collab.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.collab.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.collab.del" />
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>

      <template #ecoin>
        <UCard>
          <UiFlex type="col" class="gap-1 mb-2">
            <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Cửa Hàng</UiText>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xem</UiText>
              <SelectPermission v-model="state.ecoin.shop.list" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Thêm</UiText>
              <SelectPermission v-model="state.ecoin.shop.add" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Sửa</UiText>
              <SelectPermission v-model="state.ecoin.shop.edit" />
            </UiFlex>

            <UiFlex justify="between" class="gap-1 w-full">
              <UiText color="gray" size="sm">Xóa</UiText>
              <SelectPermission v-model="state.ecoin.shop.del" />
            </UiFlex>

            <UiFlex type="col" class="gap-1 pl-8 w-full">
              <UiText color="primary" size="sm" weight="semibold" class="w-full mb-1">Lịch sử</UiText>

              <UiFlex justify="between" class="gap-1 w-full">
                <UiText color="gray" size="sm">Xem</UiText>
                <SelectPermission v-model="state.ecoin.shop.history.list" />
              </UiFlex>

              <UiFlex justify="between" class="gap-1 w-full">
                <UiText color="gray" size="sm">Duyệt</UiText>
                <SelectPermission v-model="state.ecoin.shop.history.action" />
              </UiFlex>
            </UiFlex>
          </UiFlex>
        </UCard>
      </template>
    </UAccordion>

    <UiFlex justify="end" class="mt-1">
      <UButton @click="update" :loading="updating">Cập Nhật</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { bootConfig } = useConfigStore()
const { error } = useNotify()

const load = ref(true)
const updating = ref(false)

const state = ref({
  statistic: [],

  log: [],

  config: {
    get: [],
    edit: [],
    article: {
      get: [],
      edit: [],
    }
  },

  spend: {
    list: [],
    add: [],
    edit: [],
    del: [],
  },

  user: {
    list: [],
    edit: {
      profile: [],
      currency: [],
    },
    level: {
      list: [],
      add: [],
      edit: [],
    }
  },

  equip: {
    list: [],
    add: [],
    edit: [],
    del: [],
  },

  ads: {
    from: {
      list: [],
      add: [],
      edit: [],
      del: [],
    }
  },

  ip: {
    whitelist: {
      list: [],
      action: [],
    },
    list: [],
    action: [],
  },

  device: {
    list: [],
    action: [],
  },

  news: {
    category: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    list: [],
    add: [],
    edit: [],
    del: [],
  },

  gate: {
    list: [],
    add: [],
    edit: [],
    del: [],
  },

  payment: {
    coin: {
      list: [],
      action: [],
    },
    yuan: {
      list: [],
      action: [],
    }
  },

  game: {
    category: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    platform: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    private: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    tool: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    china: {
      list: [],
      add: [],
      edit: [],
      del: [],
    }
  },

  voucher: {
    list: [],
    add: [],
    edit: [],
    del: [],
    history: {
      list: [],
    }
  },

  mission: {
    list: [],
    add: [],
    edit: [],
    del: [],
    history: {
      list: [],
    }
  },

  forum: {
    category: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    list: [],
    edit: [],
    del: [],
  },

  collab: {
    level: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    notify: {
      list: [],
      add: [],
      edit: [],
      del: [],
    },
    withdraw: {
      list: [],
      action: [],
    },
    list: [],
    add: [],
    edit: [],
    del: [],
  },

  ecoin: {
    shop: {
      list: [],
      add: [],
      edit: [],
      del: [],
      history: {
        list: [],
        action: [],
      }
    }
  }
})

const menu = [
  { label: 'Thông kê', slot: 'statistic' },
  { label: 'Nhật ký', slot: 'log' },
  { label: 'Cài đặt', slot: 'config' },
  { label: 'Chi tiêu', slot: 'spend' },
  { label: 'Tài khoản', slot: 'user' },
  { label: 'Trang bị', slot: 'equip' },
  { label: 'Quảng cáo', slot: 'ads' },
  { label: 'IP & Device', slot: 'ip-device' },
  { label: 'Tin tức', slot: 'news' },
  { label: 'Kênh nạp', slot: 'gate' },
  { label: 'Thanh toán', slot: 'payment' },
  { label: 'Trò chơi', slot: 'game' },
  { label: 'Voucher', slot: 'voucher' },
  { label: 'Diễn đàn', slot: 'forum' },
  { label: 'Nhiệm vụ', slot: 'mission' },
  { label: 'Cộng tác viên', slot: 'collab' },
  { label: 'ECoin', slot: 'ecoin' },
]

const getPermission = async () => {
  try {
    load.value = true

    const config = await useAPI('config/manage/permission/get')
    state.value = Object.assign(state.value, config)
    load.value = false
  }
  catch(e) {
    load.value = false
  }
}

const update = async () => {
  try {
    updating.value = true

    await useAPI('config/manage/permission/update', JSON.parse(JSON.stringify(state.value)))
    getPermission()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getPermission()
</script>