<template>
  <div class="Exhibition">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="item"><GanttChart></GanttChart></div>
      </el-col>
      <el-col :span="8"
        ><div class="item"><ExcellentCaseSharing></ExcellentCaseSharing></div>
      </el-col>
      <el-col :span="8">
        <div class="item">
          <Onceday></Onceday></div
      ></el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import GanttChart from "./ganttChart.vue";
import ExcellentCaseSharing from "./excellentCaseSharing.vue";
import Onceday from "./onceday.vue";
</script>
<style scoped lang="scss">
.Exhibition {
  width: 100%;
  min-height: 300px;
  .el-row {
    height: 100%;
    margin-top: 20px;
  }
  .item {
    height: 100%;
    background-color: #fff;
  }
}
</style>
