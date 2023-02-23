<template>
  <div class="body_target__flow">
    <div v-for="(item, index) in flowList"
         :key="index"
         class="item_box">
      <div class="item always-shadow">
        <div class="item_hd"
             :style="{ backgroundImage: `url(${item.bgImage})` }">
          <div class="name">{{ item.dimension }}</div>
        </div>
        <div class="item_bd">
          <div class="Index_online">
            指标在线
            <span class="index_num">{{ item.totalOnline }}</span>
          </div>
          <div class="norm_con">
            <div class="right">
              <MyChart class="chart2"
                       :option="item.left" />
            </div>
            <div class="hr" />
            <div class="left">
              <MyChart class="chart2"
                       :option="item.right" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, reactive, toRefs, computed, onMounted, onDeactivated } from "vue";
  import MyChart from "@/components/Echart/index.vue";
  import * as echarts from "echarts";
  import bg1 from "@/assets/images/bg-1.png";
  import bg2 from "@/assets/images/bg-2.png";
  import bg3 from "@/assets/images/bg-3.png";
  import bg4 from "@/assets/images/bg-4.png";
  import bg5 from "@/assets/images/bg-5.png";
  import {
    ApiTargetFlow
  } from "../api/index";

  onMounted(() => {
    getTargetFlow();
  });
  const flowList: FlowItem[] = reactive([]);
  // 仪表盘
  const options1 = ref({
    series: [
      {
        center: ["50%", "70%"],
        type: "gauge",
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,

        splitNumber: 10,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            {
              offset: 0,
              color: "#B0D0FF",
            },
            {
              offset: 1,
              color: "#5B8FF9",
            },
          ]),

          shadowColor: "rgba(0,138,255,0.45)",
        },

        detail: {
          fontSize: 12,
          offsetCenter: [0, "0"],
          show: true,
          formatter (value: any) {
            return `${value}%`;
          },
        },
        pointer: {
          show: false, // 是否显示指针
        },
        axisLabel: false,
        progress: {
          show: true,
          roundCap: true,
          width: 5, // 进度宽
          itemStyle: {},
        },
        axisLine: {
          lineStyle: {
            width: 5, // 仪表盘修改宽度的属性
          },
        },
        axisTick: false, // 是否显示刻度
        splitLine: {
          show: false, // 是否显示分隔线。
        },
        data: [
          {
            value: 50,
          },
        ],
      },
    ],
  });
  // 圆形图
  const options2 = ref({
    tooltip: {
      trigger: "item",
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        // tooltip: {
        //   formatter: "{d}%",
        // },
        label: {
          // 饼图图形上的文本标签
          show: true,
          position: "inner", // 标签的位置
          color: "#fff",
          textStyle: {
            fontSize: 5, // 文字的字体大小
          },
          formatter: "{d}%",
        },

        emphasis: {
          // 选择的样式
          label: {
            show: true,
            color: "#fff",
            fontSize: 7,
            fontWeight: "bold",
            formatter: "{d}%",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 0, name: "L1" },
          { value: 0, name: "L2" },
          { value: 0, name: "L3" },
          { value: 0, name: "L4" },
          { value: 0, name: "L5" },
          // { value: 1048, name: "1" },
          // { value: 735, name: "2" },
          // { value: 580, name: "3" },
          // { value: 484, name: "4" },
          // { value: 300, name: "5" },
        ],
      },
    ],
  });
  const bgList = [bg1, bg2, bg3, bg4, bg5];
  // 指标总览（分流程）
  const getTargetFlow = () => {
    ApiTargetFlow().then((res: any) => {
      if (res.result && res.result.length > 0) {
        res?.result?.forEach((item: FlowItem, index: number) => {
          const percentage = Math.round((item.totalOnline / item.total) * 100);
          const copyOption1 = JSON.parse(JSON.stringify(options1.value));
          copyOption1.series[0].data = [{ value: percentage }];
          copyOption1.series[0].detail.formatter = (value: any) => `${value ? value : 0}%`;
          const copyOption2 = JSON.parse(JSON.stringify(options2.value));
          if (item.domainDetail && item.domainDetail.length > 0) {
            copyOption2.series[0].data = item.domainDetail.map((now) => ({
              value: now.total,
              name: now.domain,
            }));
          }
          item['left'] = copyOption1;
          item['right'] = copyOption2;
          item['bgImage'] = bgList[index];
          flowList.push(item);
        });
      } else {
        const newData = [{
          dimension: "IPD",
          domainDetail: [{ domain: '营销指标', total: 0 },
          { domain: '产品指标', total: 0 },
          { domain: '质量指标', total: 0 }],
          rowId: "",
          total: 0,
          totalOnline: 0
        }, {
          dimension: "SRM",
          domainDetail: [{ domain: '营销指标', total: 0 },
          { domain: '产品指标', total: 0 }],
          rowId: "",
          total: 0,
          totalOnline: 0
        }, {
          dimension: "STE",
          domainDetail: [{ domain: '营销指标', total: 0 },
          { domain: '产品指标', total: 0 }],
          rowId: "",
          total: 0,
          totalOnline: 0
        }, {
          dimension: "OTD",
          domainDetail: [{ domain: '产品指标', total: 0 }],
          rowId: "",
          total: 0,
          totalOnline: 0
        }, {
          dimension: "PMS",
          domainDetail: [{ domain: '营销指标', total: 0 }],
          rowId: "",
          total: 0,
          totalOnline: 0
        }]
        newData.forEach((item: FlowItem, index: number) => {
          const percentage = Math.round((item.totalOnline / item.total) * 100);
          const copyOption1 = JSON.parse(JSON.stringify(options1.value));
          copyOption1.series[0].data = [{ value: percentage }];
          copyOption1.series[0].detail.formatter = (value: any) => `${value ? value : 0}%`;
          const copyOption2 = JSON.parse(JSON.stringify(options2.value));
          if (item.domainDetail && item.domainDetail.length > 0) {
            copyOption2.series[0].data = item.domainDetail.map((now) => ({
              value: now.total,
              name: now.domain,
            }));
          }
          item['left'] = copyOption1;
          item['right'] = copyOption2;
          item['bgImage'] = bgList[index];
          flowList.push(item);
        });
      }
    });
  };

</script>

<style scoped lang="scss">
  .body_target__flow {
    display: flex;
    .item_box {
      width: 20%;
      padding: 10px;
      box-shadow: var(--el-box-shadow-light);

      .item {
        background-color: #fff;
        border-radius: 5px;
        .item_hd {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;

          background-repeat: no-repeat;
          background-position: top center;
          background-size: 100% auto;
          height: 70px;
          .name {
            color: #fff;
            font-size: 16px;
            padding-top: 16px;
            padding-left: 20px;
            font-weight: bold;
          }
        }
        .Index_online {
          text-align: center;
          padding: 10px 15px;
          .index_num {
            font-size: 20px;
          }
        }
        .item_bd {
          padding-bottom: 10px;

          .chart2 {
            width: 100%;
            height: 70px;
          }
        }
        .norm_con {
          display: flex;
          .hr {
            margin-top: 20px;
            height: 40px;
            width: 1px;
            background-color: #e5e5e5;
          }
          .right,
          .left {
            width: 100%;
          }
        }
      }
    }
  }
</style>