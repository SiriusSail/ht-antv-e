<template>
  <div class='sub-menu-flex background-color'>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-sidebar"
      @select="onSelect"
    >
      <el-menu-item
        v-for="route in routes"
        :key="route.name"
        :index="route.name"
        :route="route.name"
        class='el-sub-menu-sidebar'
      >
        <Iconfont :name="(route.meta.icon as any)" />
        <template #title>{{(route.meta.title as any)['/zh-CN']}}</template>
      </el-menu-item>
      <el-tooltip
        class="item"
        effect="dark"
        content="尽情期待"
        placement="right"
      >
        <el-menu-item
          key="-1"
          disabled
          index="-1"
          route="-1"
          class='el-sub-menu-sidebar'
        >
          <Iconfont name="icon-a-indexcard" />
          <template #title>生成报告</template>
        </el-menu-item>
      </el-tooltip>
    </el-menu>

    <el-menu
      class="el-menu-vertical-sidebar"
    >
      <el-menu-item
        index="13"
        class='el-sub-menu-sidebar-2'
        @click="onDrafts"
      >
        <ElTooltip
          effect='light'
          content='草稿箱'
          placement='bottom'
        >
          <Iconfont class={{styles.graph_icon}} name='icon-drafts' />
        </ElTooltip>
      </el-menu-item>
      <el-menu-item
        index="9"
        class='el-sub-menu-sidebar-2'
      >
        <Iconfont name='icon-task' />
      </el-menu-item>
      <el-menu-item
        index="10"
        class='el-sub-menu-sidebar-2'
      >
        <Iconfont name='icon-enable' />
      </el-menu-item>
      <el-menu-item
        index="11"
        class='el-sub-menu-sidebar-2'
      >
        <Iconfont name='icon-install' />
      </el-menu-item>
      <el-menu-item
        index="12"
        class='el-sub-menu-sidebar-2'
      >
        <Iconfont name='icon-help' />
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, Ref, computed } from 'vue'
import { useRouter } from 'vue-router';
import Iconfont from '@/components/Iconfont/index'
// import flowchartRouter from "@/router/flowchartRouter";
import roleStore from "@/store/role";
import flowchartSidebarStore from "./store";

export default defineComponent({
  components: {
    Iconfont
  },
  setup() {
    // const routes = flowchartRouter[0].children
    const router = useRouter();
    const role = roleStore();
    const routes = role.routers.find((item) => item.name === 'flowchart')?.children || [];
    const defaultActive = router.currentRoute.value.name

    const store = flowchartSidebarStore();
    const onDrafts = () => {
      store.isShowDrafts = true;
    }
    const onSelect = (name: string) => {
      router.push({name});
    }
    return {
      routes,
      onDrafts,
      onSelect,
      defaultActive,
    }
  },
})
</script>

<style lang="scss" scoped>
.sub-menu-flex {
  display: flex;
  padding-bottom: 40px;
  height: 100%;
  width: 80px;
  flex-direction: column;
  justify-content: space-between;
}
.el-menu-vertical-sidebar:not(.el-menu--collapse) {
  width: 80px;
  background-color: transparent;
  border: none;
  .el-sub-menu-sidebar {
    color: #fff;
    line-height: 28px;
    white-space: inherit;
    text-align: center;
    padding: 0 !important;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;
  }
  .el-sub-menu-sidebar-2 {
    color: #fff;
    line-height: 28px;
    text-align: center;
    padding: 0 !important;
    height: 28px;
  }
  .is-active {
    background-color: #20A0FF;
  }
}
</style>