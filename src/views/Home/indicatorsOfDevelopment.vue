<template>
  <div class="digitalMarketing">
    <CqHead></CqHead>
    <!-- body -->
    <CqChartGourp />
    <Exhibition></Exhibition>
    <!-- fotter -->
    <CqFotter />
  </div>
</template>

<script lang="ts" setup>
  import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    computed,
    onMounted,
    onDeactivated,
  } from "vue";
  import CqHead from "./busComponent/head.vue";
  import CqFotter from "./busComponent/fotter.vue";
  import CqChartGourp from "./busComponent/chartGourp.vue";
  import Exhibition from "./busComponent/exhibition.vue";
</script>

<style scoped lang="scss">
  .digitalMarketing {
    padding: 0 10px;
    background-color: #f5f7fa;
  }
</style>
