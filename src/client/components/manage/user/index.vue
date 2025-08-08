<template>
  <UiFlex>
    <UBadge variant="soft" color="gray" class="cursor-pointer" @click="modal = true">
      {{ user.username }}
    </UBadge>

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserBox :fetch-id="user._id" :collab="collab">
        <UAccordion
          class="mt-4"
          color="primary"
          variant="soft"
          size="md"
          :items="menu"
        >
          <template #default="{ item, open }">
            <UButton size="md" class="bg-gray-1000 mb-2">
              <UiText class="text-white">{{ item.label }}</UiText>
            </UButton>
          </template>

          <template #log>
            <ManageUserLog :user="user._id" :collab="collab" />
          </template>

          <template #payment>
            <DataPaymentHistory :user="user._id" :collab="collab" />
          </template>

          <template #played>
            <DataGamePlayed :user="user._id" :collab="collab"/>
          </template>

          <template #invite>
            <ManageUserInvite :user="user._id" :collab="collab" />
          </template>

          <template #ip>
            <ManageUserIp :user="user._id" :collab="collab" />
          </template>

          <template #device>
            <ManageUserDevice :user="user._id" :collab="collab" />
          </template>

          <template #mission>
            <DataMissionHistory :user="user._id" :collab="collab" />
          </template>
        </UAccordion>
      </ManageUserBox>
    </UModal>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['user', 'collab'])

const modal = ref(false)

const menu = [
  { label: 'Dòng thời gian', slot: 'log' },
  { label: 'Nạp tiền', slot: 'payment' },
  { label: 'Trò chơi đã chơi', slot: 'played' },
  { label: 'Bạn bè đã mời', slot: 'invite' },
  { label: 'Địa chỉ IP', slot: 'ip' },
  { label: 'Thiết bị', slot: 'device' },
  { label: 'Nhiệm vụ', slot: 'mission' },
]
</script>