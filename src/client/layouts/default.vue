<template>
  <div class="relative h-full min-h-full pt-[var(--header-size)]">
    <LayoutPublicHeader />

    <UiFlex class="px-4 py-4 lg:gap-6 gap-0" items="start">
      <div class="
        HideScroll
        sticky top-[calc(var(--header-size)+1rem)]
        bg-gray-1000 bg-opacity-90 backdrop-blur-lg rounded-2xl
        min-h-[calc(100vh-2rem-var(--header-size))] max-h-[calc(100vh-2rem-var(--header-size))] overflow-y-auto
        lg:min-w-[250px] lg:max-w-[250px] lg:w-[250px]
        hidden xl:flex
      ">
        <LayoutPublicNav />
      </div>

      <UContainer 
        class="relative grow !px-0" 
        style="min-height: calc(100% - var(--header-size));" 
        :ui="{ constrained: 'max-w-[1080px] w-full overflow-x-hidden' }
      ">
        <slot></slot>
      </UContainer>

      <div class="
        sticky top-[calc(var(--header-size)+1rem)]
        min-h-[calc(100vh-2rem-var(--header-size))] max-h-[calc(100vh-2rem-var(--header-size))] overflow-hidden
        lg:min-w-[300px] lg:max-w-[300px] lg:w-[300px]
        hidden lg:flex flex-col gap-2
      ">
        <UiFlex type="col" class="gap-1">
          <DataSocial class="w-full" />
          <DataDownload class="w-full"/>
        </UiFlex>

        <SocketNav class="grow" />
      </div>
    </UiFlex>
  </div>
</template>

