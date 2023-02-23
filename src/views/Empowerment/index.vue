<template>
  <div class="Empowerment">
    <el-row :gutter="20">
      <el-col :span="6"><Ranking :type="0" /></el-col>
      <el-col :span="6"><Ranking :type="1" /></el-col>
      <el-col :span="6"><Ranking :type="2" /></el-col>
      <el-col :span="6"><Ranking :type="3" /></el-col>
    </el-row>
    <div class="table-con">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="t-con">
            <p class="list-title">开发任务列表</p>
            <DevTaskList></DevTaskList>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="t-con">
            <p class="list-title">推荐信息列表</p>
            <RecommendationList></RecommendationList></div
        ></el-col>
        <el-col :span="8">
          <div class="t-con">
            <p class="list-title">知识贡献列表</p>
            <KnowledgeList></KnowledgeList></div
        ></el-col>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineComponent, ref, reactive, toRefs } from "vue";
import DevTaskList from "./components/DevTaskList.vue";
import KnowledgeList from "./components/KnowledgeList.vue";
import RecommendationList from "./components/RecommendationList.vue";
import Ranking from "./components/Ranking.vue";
</script>
<style scoped lang="scss">
.Empowerment {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 80px);
  .table-con {
    padding-top: 20px;
  }

  .list-title {
    font-weight: 600;
    color: #303133;
    padding-bottom: 10px;
    text-align: center;
    // padd
  }
  :deep(.h-table) {
    height: 450px;
  }

  .t-con {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    min-height: 600px;
  }

  :deep(.pagination) {
    text-align: center;
  }
  :deep(.pointer) {
    cursor: pointer;
  }
}
</style>
