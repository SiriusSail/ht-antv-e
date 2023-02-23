<template>
  <div class="chart_gourp">
    <el-card class="box-card">
      <div class="chart_box_body">
        <MyChart
          ref="refChart"
          v-if="Object.keys(option).length > 0"
          :option="option"
        />
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  PropType,
  nextTick,
  onMounted,
} from "vue";
import MyChart from "@/components/Echart/index.vue";

export type CardItem = {
  label: string; //
  num: number; //
};

type List = {
  [key in string]: number;
};

export default defineComponent({
  components: {
    MyChart,
  },
  props: {
    list: {
      // 列表
      type: Object as PropType<List>,
      required: true,
    },
    icon: {
      // 图标
      type: String,
      default: "",
    },
    title: {
      // 标题
      type: String,
      default: "",
    },
  },
  setup(props) {
    const { list, title } = toRefs(props);
    const thousands = (num: number) => {
      const str = num.toString();
      const reg =
        str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
      return str.replace(reg, "$1,");
    };
    const refChart = ref(null);
    const num = ref(0);
    const option = ref({
      title: {
        text: "",
        left: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: "60%",
          top: "50px",
          label: {
            fontSize: 10,
          },
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 4,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });

    const init = (data: any) => {
      const slist: any = [];
      for (const key in data) {
        slist.push({ name: key + " " + data[key], value: data[key] });
        num.value += data[key];
      }
      option.value.series[0].data = slist;
      option.value.series[0].title = title.value + " " + num.value;
      option.value.title.text = title.value + " " + num.value;
      nextTick(() => {
        refChart.value.echartInit();
      });
    };
    return {
      thousands,
      init,
      option,
      num,
      refChart,
      list,
    };
  },
});
</script>
<style scoped lang="scss">
// .statistical-card {
//   border: 1px solid #c0ccda;
//   background-color: #fff;
//   border-radius: 8px;
//   overflow: hidden;
//   .head {
//     height: 53px;
//     display: flex;
//     align-items: center;
//     background-color: #ecf4ff;
//   }
//   .title {
//     color: #333333;
//     font-size: 20px;
//     font-weight: 700;
//     padding-left: 8px;
//   }
//   .con {
//     .item {
//       height: 50px;
//       display: flex;
//       align-items: center;
//       padding: 0 24px;
//       border-top: 1px solid #c0ccda;
//     }
//     .label {
//       padding-right: 6px;
//       color: #333333;
//     }
//     .num {
//       color: #1b3c90;
//       font-size: 20px;
//       font-weight: 700;
//     }
//     .icon {
//       font-size: 20px;
//     }
//   }
// }
//图表
.chart_gourp {
  .box-card {
    .chart_box_head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      .box_head_title {
        font-weight: 500;
        font-size: 20px;

        line-height: 30px;
        flex: 1;
        span {
          cursor: pointer;
        }
      }
      .operate {
        font-size: 14px;
        color: #20a0ff;
        cursor: pointer;
      }
    }
    .num_label {
      font-size: 14px;
      color: #333333;
      display: flex;
      align-items: center;
      flex-direction: row;
      height: 22px;
      .index_num {
        display: inline-block;
        height: 22px;
        line-height: 22px;
      }
    }
    .empowerment {
      font-size: 12px;
      color: #cccccc;
    }
    .bodyInfo {
      position: absolute;
      left: 0;
      top: 18px;
      z-index: 1;
    }
    .chart_box_body {
      position: relative;
      display: flex;
      :deep(.chart_dom) {
        width: 100%;
        height: 200px;
      }
    }
    .body_right {
      padding-left: 4px;
      font-size: 14px;
      min-width: 60px;
      color: #cccccc;
      width: 50px;

      .progress {
        font-size: 12px;
        .pending {
          span {
            color: #b22711;
          }
        }
        .handing {
          span {
            color: #1b3c90;
          }
        }
      }
    }
    .body_left {
      flex: 1;
    }
    .icon-rise {
      font-size: 18px;
      color: #1ec435;
    }
    .icon-decline {
      font-size: 18px;
      color: #f53535;
    }
    .el-icon-minus {
      font-size: 18px;
      color: #f1a644;
    }
  }
}
</style>
