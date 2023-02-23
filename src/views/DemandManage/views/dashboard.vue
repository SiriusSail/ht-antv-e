<template>
  <div class="Dashboard">
    <div class="dataPeriod">数据期间：2021年10月20日 15:00:00</div>
    <el-row :gutter="20">
      <el-col :span="6">
        <DashboardCard
          label="指标在线量"
          icon="el-icon-warning-outline"
          body-border
          height="140px"
        >
          <template #body>
            <div class="online">
              <div class="count">
                <span class="num">831</span>
                <span class="unit">个</span>
              </div>
              <div class="than">
                <div class="than-item">
                  <span class="than-label">月比 </span>
                  <span class="percentage">100%</span>
                  <em class="el-icon-caret-top" />
                </div>
                <div class="than-item">
                  <span class="than-label">环&nbsp;比</span>
                  <span class="percentage">100%</span>
                  <em class="el-icon-caret-bottom" />
                </div>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="card-footer">本周新增 {{ thousands(100) }}个</div>
          </template>
        </DashboardCard>
      </el-col>
      <el-col :span="6">
        <DashboardCard
          label="指标月访问量"
          icon="el-icon-warning-outline"
          body-border
          height="140px"
        >
          <template #body>
            <Echart :option="option1"></Echart>
          </template>
          <template #footer>
            <div class="card-footer">今日访问量 {{ thousands(10345) }}</div>
          </template>
        </DashboardCard>
      </el-col>
      <el-col :span="6">
        <DashboardCard
          label="指标开发走势"
          icon="el-icon-warning-outline"
          body-border
          height="140px"
        >
          <template #body>
            <Echart :option="option2"></Echart>
          </template>
          <template #footer>
            <div class="card-footer">本周上线 {{ thousands(100) }}个</div>
          </template>
        </DashboardCard>
      </el-col>
      <el-col :span="6">
        <DashboardCard
          label="指标评审态势"
          icon="el-icon-warning-outline"
          body-border
          height="140px"
        >
          <template #body>
            <Echart :option="option3"></Echart>
          </template>
          <template #footer>
            <div class="card-footer">需求变更率 10%</div>
          </template>
        </DashboardCard>
      </el-col>
    </el-row>
    <div class="chart2-con">
      <el-row :gutter="20">
        <el-col :span="8">
          <DashboardCard label="指标在线率" height="200px">
            <template #body>
              <Echart :option="option4"></Echart>
            </template>
          </DashboardCard>
        </el-col>
        <el-col :span="8">
          <DashboardCard label="指标在线类型分布" height="200px">
            <template #body>
              <div class="two-pie">
                <Echart :option="option5"></Echart>
                <Echart :option="option6"></Echart>
              </div>
            </template>
          </DashboardCard>
        </el-col>
        <el-col :span="8">
          <DashboardCard label="指标研发资源走势" height="200px">
            <template #body>
              <Echart :option="option7"></Echart>
            </template>
          </DashboardCard>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <el-col :span="24">
        <div class="chart3-con">
          <Echart :option="option10"></Echart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import DashboardCard from "../component/dashboard-card.vue";
import Echart from "@/components/Echart/index.vue";
import { thousands } from "@/utils/func";

export default defineComponent({
  components: { DashboardCard, Echart },
  setup() {
    const state = reactive({});
    const option1 = {
      grid: {
        x: 30,
        y: 10,
        x2: 10,
        y2: 30,
        borderWidth: 10,
      },

      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          areaStyle: {},
        },
      ],
    };
    const option2 = {
      grid: {
        x: 30,
        y: 10,
        x2: 10,
        y2: 30,
        borderWidth: 10,
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };
    const option3 = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "right",
        textStyle: {
          fontSize: 10,
        },
      },
      series: [
        {
          label: {
            // 饼图图形上的文本标签
            normal: {
              show: true,
              position: "inner", // 标签的位置
              textStyle: {
                color: "#fff",
                fontWeight: 300,
                fontSize: 10, // 文字的字体大小
              },
              formatter: "{d}%",
            },
          },
          center: ["30%", "50%"],
          radius: "80%",
          type: "pie",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    const option4 = {
      grid: {
        left: "0%",
        right: "0%",
        bottom: "0%",
        containLabel: true,
      },
      legend: {},
      tooltip: {},
      dataset: {
        dimensions: ["product", "2015", "2016", "2017"],
        source: [
          { product: "a", 2015: 43.3, 2016: 85.8, 2017: 93.7 },
          { product: "b", 2015: 83.1, 2016: 73.4, 2017: 55.1 },
          { product: "c", 2015: 86.4, 2016: 65.2, 2017: 82.5 },
          { product: "d", 2015: 72.4, 2016: 53.9, 2017: 39.1 },
        ],
      },
      xAxis: { type: "category" },
      yAxis: {},
      // Declare several bar series, each will be mapped
      // to a column of dataset.source by default.
      series: [
        { type: "bar", barWidth: "20%" },
        { type: "bar", barWidth: "20%" },
        { type: "bar", barWidth: "20%" },
      ],
    };
    const option5 = {
      grid: {
        x: 30,
        y: 10,
        x2: 10,
        y2: 30,
        borderWidth: 10,
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        // orient: "vertical",
        // left: "top",
        bottom: "0",
        itemWidth: 10,
        itemHeight: 4,
        textStyle: {
          fontSize: 8,
        },
      },
      series: [
        {
          label: {
            // 饼图图形上的文本标签
            normal: {
              show: true,
              position: "inner", // 标签的位置
              textStyle: {
                color: "#fff",
                fontWeight: 300,
                fontSize: 10, // 文字的字体大小
              },
              formatter: "{d}%",
            },
          },
          center: ["50%", "40%"],
          radius: "60%",
          type: "pie",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    const option6 = {
      grid: {
        x: 30,
        y: 10,
        x2: 10,
        y2: 30,
        borderWidth: 10,
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "right",
        itemWidth: 10,
        itemHeight: 4,
        textStyle: {
          fontSize: 8,
        },
      },
      series: [
        {
          label: {
            // 饼图图形上的文本标签
            normal: {
              show: true,
              position: "inner", // 标签的位置
              textStyle: {
                color: "#fff",
                fontWeight: 300,
                fontSize: 10, // 文字的字体大小
              },
              formatter: "{d}%",
            },
          },
          center: ["25%", "50%"],
          radius: "50%",
          type: "pie",
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
    const option7 = {
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Email", "Union Ads", "Video Ads", "Direct", "Search Engine"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Email",
          type: "line",
          stack: "Total",
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          stack: "Total",
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ads",
          type: "line",
          stack: "Total",
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "Direct",
          type: "line",
          stack: "Total",
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "Search Engine",
          type: "line",
          stack: "Total",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };
    const option10 = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      grid: {
        left: "2%",
        right: "2%",
        bottom: "0%",
        borderWidth: 10,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
        name: "单位",
      },
      series: [
        {
          itemStyle: {
            color: "rgb(127,190,158)",
          },
          showSymbol: false,
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          areaStyle: {},
        },
      ],
    };
    return {
      option1,
      option2,
      option3,
      option4,
      option5,
      option6,
      option7,
      option10,
      thousands,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.Dashboard {
  padding: 10px;
  .dataPeriod {
    padding: 10px 0;
    border-bottom: 1px solid #ccc;
    margin-bottom: 10px;
  }
  .chart2-con {
    margin-top: 20px;
  }
  .online {
    font-size: 16px;
    color: #666;
    .count {
      text-align: center;
    }
    .num {
      font-size: 34px;
      font-weight: 600;
      color: #333;
    }
    .than {
      padding-top: 10px;
      .than-item {
        padding-top: 10px;
      }
      .than-label {
        padding-right: 10px;
      }
      .el-icon-caret-top,
      .el-icon-caret-bottom {
        font-size: 18px;
        padding-left: 6px;
      }
      .el-icon-caret-top {
        color: rgb(242, 38, 53);
      }
      .el-icon-caret-bottom {
        color: rgb(87, 194, 45);
      }
    }
  }
  .card-footer {
    font-size: 16px;
    color: #666;
  }
  .two-pie {
    display: flex;
    height: 100%;
    .chart_dom {
      flex: 1;
    }
  }
  .chart3-con {
    margin-top: 20px;
    background-color: #fff;
    height: 200px;
    padding: 10px;
    border-radius: 8px;
  }
}
</style>
