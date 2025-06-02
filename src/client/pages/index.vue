<template>
  <div class="HomePage">
    <!--News-->
    <DataNewsHome class="mb-2"/>

    <!--Promo, Download, Social-->
    <div class="@container">
      <div class="grid grid-cols-12 xl:gap-2 gap-1">
        <DataPromoRegisterCoin class="@3xl:col-span-4 col-span-6" />
        <DataPromoPaymentFrist class="@3xl:col-span-4 col-span-6"/>
        <DataPromoPaymentSecond class="@3xl:col-span-4 @3xl:flex hidden col-span-6" />
        <DataDownload class="lg:hidden col-span-6" />
        <DataSocial class="lg:hidden col-span-6" />
      </div>
    </div>

    <!--Game Private-->
    <div class="my-12"><DataGamePrivateHome /></div>

    <!--Game Tool-->
    <div class="my-12"><DataGameToolHome /></div>

    <!--Game China-->
    <div><DataGameChinaHome /></div>
  </div>
</template>

<script setup>
const configStore = useConfigStore()
</script>