<template>
  <AppTitle />
  <div class="DemandManage">
    <Sidebar></Sidebar>
    <div class="m-con">
      <router-view></router-view>
    </div>
  </div>
</template>
<script lang="ts">
import AppTitle from "@/layout/components/AppTitle/index";
import { defineComponent, ref, reactive, toRefs } from "vue";
import Sidebar from "./component/Sidebar.vue";
import Kanban from "./views/kanban.vue";
import RouterView from "@/router/routerView.vue";
export default defineComponent({
  components: { Sidebar, RouterView, AppTitle },
  setup() {
    const state = reactive({});
    const routeActive = ref(0);
    const routeList = [
      {
        name: "kanban",
        component: Kanban,
      },
    ];

    return {
      routeActive,
      routeList,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.DemandManage {
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
