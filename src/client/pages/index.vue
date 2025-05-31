<template>
  <div class="HomePage">
    <!--News-->
    <DataNewsHome class="mb-2"/>

    <!--Promo, Download, Social-->
    <div class="@container">
      <div class="grid grid-cols-12 @3xl:gap-2 gap-0">
        <DataPromoRegisterCoin class="@3xl:col-span-4 col-span-6" />
        <DataPromoPaymentFrist class="@3xl:col-span-4 col-span-6"/>
        <DataPromoPaymentSecond class="@3xl:col-span-4 col-span-6 @3xl:flex hidden" />
        <DataDownload class="@3xl:hidden col-span-6" />
        <DataSocial class="@3xl:hidden col-span-6" />
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