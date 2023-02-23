<template>
  <div class="digitalMarketing">
    <CqHead></CqHead>
    <!-- 指标统计 -->
    <el-card body-style='padding:0;'>
      <el-row :gutter="20">
        <el-col :span="18">
          <CqTarget />
        </el-col>
        <el-col :span="6">
          <CqStatistics />
        </el-col>
      </el-row>
    </el-card>
    <!-- body -->
    <div class="access_col">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card body-style='padding:20px;'>
            <CqIndexAccess />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card body-style='padding:20px;'>
            <CqResourcesTrend />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 贡献 -->
    <div class="contribution">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card body-style='padding:0;'>
            <el-carousel :interval="5000"
                         height='600px'
                         arrow="always">
              <el-carousel-item v-for="(item,index) in 2"
                                :key="item">
                <ContributionDegree v-if="index===0" />
                <CqSales v-if="index===1" />
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card body-style='padding:0;height:600px;'>
            <CqContributionTop5 />
            <CqRectangle height='235px' />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- fotter -->
    <CqFotter />
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from "vue";
  import CqHead from "./busComponent/head.vue";
  import ContributionDegree from "./busComponent/contributionDegree.vue";
  import CqFotter from "./busComponent/fotter.vue";
  import CqRectangle from "./busComponent/rectangle.vue";
  import CqStatistics from "./busComponent/statistics.vue";
  import CqTarget from "./busComponent/target.vue";
  // import CqChartGourp from "./busComponent/chartGourp.vue";
  import CqContributionTop5 from "./busComponent/contributionTop5.vue";
  import CqSales from "./busComponent/sales.vue";
  import CqIndexAccess from "./busComponent/IndexAccess.vue";
  import CqResourcesTrend from "./busComponent/resourcesTrend.vue";

</script>

<style scoped lang="scss">
  .digitalMarketing {
    background-color: #f5f7fa;
    .contribution {
      padding: 0 20px;
      margin-top: 20px;
    }
    .access_col {
      margin-top: 20px;
    }
  }
</style>