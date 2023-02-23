<template>
  <div class="search_box">
    <div class="search_date"><Time /></div>
    <Search class="searchInput"
            v-model="state.key"
            @search="handleSearch()"></Search>

    <el-button type="primary"
               class="common"
               size="small"
               @click="handleFlowChart()">
      创建指标</el-button>
    <el-button type="primary"
               disabled
               size="small"
               @click="handleKTM()"> KTM</el-button>
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
  import Search from "@/components/Search/Search-input.vue";
  import Time from "@/components/Time/index.vue";
  import * as Element from "element-plus";
  import { useRouter } from "vue-router";

  const { ElMessage } = Element;
  const router = useRouter();
  const state = reactive({
    key: "",
  });
  const handleSearch = () => {
    if (!state.key) {
      ElMessage({
        message: "请输入搜索关键字",
        type: "warning",
        customClass: "msgZindex",
      });
      return;
    }
    router.push(`/indexOnline/index?key=${state.key}&domain=all`);
  };
  const handleFlowChart = () => {
    router.push("/flowchart/index");
  };
  const handleKTM = () => {
    // router.push("/flowchart/index");
  };
</script>

<style scoped lang="scss">
  .search_box {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px 30px;
    .search_date {
      margin-right: 150px;
      letter-spacing: 0.5px;
    }
    .common {
      margin-left: 20px;
    }
  }
</style>
