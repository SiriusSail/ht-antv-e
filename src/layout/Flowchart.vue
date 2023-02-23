<template>
  <section class="app-main">
    <app-title></app-title>

    <div class="app-content">
      <div class="flow-chart">
        <div class="flow-chart-left">
          <flowchart-sidebar></flowchart-sidebar>
        </div>
        <div class="flow-chart-content">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" :key="$route.path" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import AppTitle from "./components/AppTitle/index";
import FlowchartSidebar from "./components/FlowchartSidebar/index.vue";

export default defineComponent({
  name: "AppMain",
  components: {
    AppTitle,
    FlowchartSidebar,
  },
  setup() {
    return {};
  },
});
</script>
<style scoped>
.app-main {
  height: 100vh;
  width: 100%;
  position: relative;
  /* overflow: hidden; */
  background-color: white;
  display: flex;
  flex-direction: column;
}

.flow-chart-left {
  width: 80px;
}

.flow-chart-content {
  flex: 1;
  overflow: hidden;
}

.flow-chart {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  height: 100%;
}

.app-content {
  height: calc(100vh - 78px);
  flex: 1;
  position: relative;
  overflow: auto;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
