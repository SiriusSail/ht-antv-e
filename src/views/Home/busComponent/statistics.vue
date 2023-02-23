<template>
  <div class="statistics">
    <div class="li" @click="href('/indexOnline/index')">
      <div class="label">
        <em class="icon-index iconfont" />
        <span class="label_content">指标在线</span>
      </div>
      <div class="num">
        <span>{{ thousands(state.summaryTotals.online) }}</span>
        <span class="unit">个</span>
      </div>
    </div>
    <div class="li" @click="href('/DataCard')">
      <div class="label">
        <em class="icon-version iconfont" />
        <span class="label_content">数据卡片</span>
      </div>
      <div class="num">
        <span>{{ thousands(state.summaryTotals.version) }}</span>
        <span class="unit">个</span>
      </div>
    </div>
    <div class="li" @click="href('/empowerment')">
      <div class="label">
        <em class="icon-participant iconfont" />
        <span class="label_content">指标贡献</span>
      </div>
      <div class="num">
        <span>{{ thousands(state.summaryTotals.contribution) }}</span>
        <span class="unit">人</span>
      </div>
    </div>
    <div class="li" @click="href('/myhelp')">
      <div class="label">
        <em class="icon-mutual iconfont" />
        <span class="label_content">互动参与</span>
      </div>
      <div class="num">
        <span>{{ thousands(state.summaryTotals.helpTotal) }}</span>
        <span class="unit">人•次</span>
      </div>
    </div>
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

import * as echarts from "echarts";
import { useRouter } from "vue-router";
import { SummaryTotals } from "../api/index";
const router = useRouter();
const state = reactive({
  summaryTotals: {
    contribution: 0,
    helpTotal: 0,
    online: 0,
    version: 0,
  },
});
const thousands = (num: number) => {
  const str = num.toString();
  const reg =
    str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, "$1,");
};
// 各项数据总结
const getSummaryTotals = () => {
  SummaryTotals().then((res: any) => {
    state.summaryTotals = res.result;
  });
};
onMounted(() => {
  getSummaryTotals();
});
const href = (url: string) => {
  router.push(url);
};
</script>

<style scoped lang="scss">
.statistics {
  padding-left: 40px;
  padding-top: 12px;
  .li {
    padding: 10px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    cursor: pointer;
    .label {
      color: #666;
      display: flex;
      align-items: center;
    }
    .iconfont {
      font-size: 20px;
    }
    .label_content {
      padding-left: 5px;
    }
    .num {
      padding-left: 30px;
      padding-right: 10px;
      text-align: left;
      font-size: 22px;
      color: #20a0ff;
      font-weight: bold;
    }
    .unit {
      font-size: 12px;
      color: #20a0ff;
      font-weight: 400;
    }
  }
}
</style>
