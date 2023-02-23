<template>
  <div class="rectangle_box">
    <MyChart ref='refChart'
             class="chart3"
             :style="{height:props.height}"
             :option="options"
             @eventClick='handleItem' />
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, onMounted } from "vue";
  import MyChart from "@/components/Echart/index.vue";
  import { ClipboardManager } from "node_modules/@antv/x6/lib/graph/clipboard";
  import { FlowReferenceTotal } from "../api/index";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const props = defineProps({
    height: ''
  })
  //  矩形图
  const getLevelOption = () => [
    {
      itemStyle: {
        borderWidth: 0,
        gapWidth: 5,
      },
    },
    {
      itemStyle: {
        gapWidth: 1,
        borderColorSaturation: 1,
      },
    },
    {
      itemStyle: {
        gapWidth: 1,
      },
    },
  ];
  // 矩形
  const options = ref({
    tooltip: {
      formatter: (info: any) => `${info.data.name}：${info.data.value}`,
    },
    series: [
      {
        legend: {
          selectedMode: false,
        },
        nodeClick: false, // 禁止点击
        roam: false, // 禁止拖动

        labelLine: {
          show: false,
        },
        breadcrumb: {
          show: false,
        },
        label: {
          color: "#666666",
        },
        height: "100%",
        width: "100%",
        type: "treemap",
        colorAlpha: [1, 1],
        colorSaturation: [1, 1],
        color: [
          "#C6F6E2",
          "#DFECFF",
          "#DFECFF",
          "#D8F0FF",
          "#C2E8FF",
          "#FFE8E3",
          "#DFECFF",
          "#D8F0FF",
          "#DFECFF",
        ],
        emphasis: {
          focus: "none",
          itemStyle: {
            colorSaturation: [0.9, 1],
            colorAlpha: [0.9, 1],
          },
        },
        data: [
          {
            name: "总数据",
            value: 100,
            children: [
              // {
              //   name: "首客成交率",
              //   value: 20,
              //   children: [
              //     {
              //       name: "总客流",
              //       value: 20,
              //     },
              //     {
              //       name: "有效线索量",
              //       value: 10,
              //     },
              //     {
              //       name: "有效线索量",
              //       value: 8,
              //     },
              //     {
              //       name: "有效线索成交率",
              //       value: 50,
              //     },
              //     {
              //       name: "新增订单数",
              //       value: 20,
              //     },
              //     {
              //       name: "未交车订单数",
              //       value: 10,
              //     },
              //   ],
              // },
            ],
          },
        ],
        levels: getLevelOption(),
      },
    ],
  });
  const refChart = ref(null)

  // 用户排行榜
  const getFlowReferenceTotal = () => {
    options.value.series[0].data[0].children = []
    FlowReferenceTotal().then((res: any) => {
      if (res.result.length > 0) {
        res.result.map((item: any) => {
          options.value.series[0].data[0].children.push({ name: item.nodeName, value: item.total })
        })
        refChart.value.echartInit()
      }
    });
  };
  const handleItem = (data) => {
    router.push(`/indexOnline/index?key=${data.name}&domain=all`);
  }

  onMounted(() => {
    getFlowReferenceTotal()
  })

</script>

<style scoped lang="scss">
  .rectangle_box {
    border-top: 1px solid #dcdfe6;
    margin: 0 10px;
    padding: 10px 0;
    .chart3 {
      height: 190px;
    }
  }
</style>