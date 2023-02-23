<template>
  <AppTitle />
  <div class="MarketingMetrics">
    <Sidebar></Sidebar>
    <div class="m-con">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Sidebar from "./components/Sidebar.vue";
import AppTitle from "@/layout/components/AppTitle/index";
export default defineComponent({
  components: { Sidebar, AppTitle },
  setup() {},
});
</script>
<style lang="scss" scoped>
.MarketingMetrics {
  padding: 10px;
  background-color: rgb(240, 242, 242);
  width: 100%;
  display: flex;
  min-height: calc(100vh - 80px);
  overflow-y: auto;

  .m-con {
    border-radius: 4px;
    flex: 1;
    overflow: hidden;
    padding: 0 20px;
    background-color: #fff;
  }
}
</style>
