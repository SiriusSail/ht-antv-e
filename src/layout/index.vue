<template>
  <div class="app-wrapper">
    <div class="sidebar-content main-container">
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useResize from "@/hooks/useResize";
import AppMain from "./components/AppMain.vue";

export default defineComponent({
  name: "Layout",
  components: {
    AppMain,
  },
  setup() {
    useResize();
    return {};
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  // height: 100%;
  // width: 100%;
  // overflow: scroll;
  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.setting-item {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .setting-draw-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }
  .divider {
    width: 100%;
    display: flex;
    clear: both;
    min-width: 100%;
    margin: 10px 0;

    box-sizing: border-box;
    padding: 0px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    list-style: none;
    line-height: 1.5715;
  }
}
.hide-header {
  display: none;
}
.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 63px);
}

.mobile .fixed-header {
  width: 100%;
}
</style>
