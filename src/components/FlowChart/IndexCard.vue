<template>
  <div class="IndexCard"
       @click="href()">
    <div class="chart">
      <h1>{{ item.domain || item.dimension }} <span class="tag">优</span></h1>
      <MyChart class="ring"
               :option="options"></MyChart>
    </div>
    <div class="info">
      <div class="count">
        总数 <span>{{ item.total }}</span> 个
      </div>
      <p>
        原子指标 <span>{{ item.totalOrigin }}</span> 个
      </p>
      <p>
        复合指标 <span>{{ item.totalComplex }}</span> 个
      </p>
      <p>
        衍生指标 <span>{{ item.totalExtend }}</span> 个
      </p>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs, PropType } from "vue";
  import MyChart from "@/components/Echart/index.vue";
  import router from "@/router";

  // export interface IndexCardItem {
  //   title: string;
  //   count: number;
  //   atomic: number;
  //   composite: number;
  //   derivative: number;
  // }
  export interface CardItem {
    domain?: string; // 标题
    dimension?: string;
    rowId: string;
    total: number; // 总数
    totalComplex: number; // 复合指标
    totalExtend: number; // 衍生指标
    totalOnline: number;
    totalOrigin: number; // 原子指标
    code: string;
  }

  export default defineComponent({
    components: { MyChart },
    props: {
      item: {
        type: Object as PropType<CardItem>,
        required: true,
        default: () => { },
      },
      isHref: {
        required: false,
        default: false,
      },
    },

    setup (props) {
      // const e = 33.3;
      const e = Math.round((props.item.totalOnline / props.item.total) * 100) || 0;
      const state = reactive({
        options: {
          title: {
            show: true,
            text: `${e}%`,
            x: "center",
            y: "center", // 通过x,y将标题(进度)定位在圆环中心
            textStyle: {
              fontSize: "10",
              color: "#333",
              fontWeight: "400",
            },
          },
          tooltip: {
            trigger: "item",
            formatter: "{d}%",
            show: false,
          },
          legend: {
            orient: "vertical",
            x: "left",
            show: false,
          },
          series: {
            name: "",
            type: "pie",
            radius: ["65%", "85%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: true,
            hoverAnimation: false,
            label: {
              normal: {
                show: false,
                position: "center",
              },
              emphasis: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            data: [
              {
                value: e,
                name: "",
                itemStyle: {
                  width: 100,
                  color: "#FCA47F",
                },
              },
              {
                value: 100 - e,
                name: "",
                itemStyle: {
                  color: "#ccc",
                },
              },
            ],
          },
        },
      });
      const href = () => {
        if (!props.isHref) return;
        // router.push("/indexOnline/index");
        console.log(props.item);
        location.href = `#/indexOnline/index?domain=${props.item.code != undefined ? props.item.code : ""
          }`;
      };
      return {
        href,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped lang="scss">
  .IndexCard {
    cursor: pointer;
    width: 220px;
    height: 122px;
    background: #ffffff;
    box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    border: 2px solid #e0eaf2;
    display: flex;
    padding-top: 20px;
    padding-bottom: 15px;
    h1 {
      text-align: center;
      font-size: 14px;
      font-weight: 800;
      color: #333333;
      line-height: 20px;
      span {
        font-weight: 800;
      }
      .tag {
        font-size: 10px;
        width: 15px;
        height: 15px;
        color: #34a976;
        background: #c0ffe4;
        border-radius: 2px;
      }
    }
    .count {
      font-size: 14px;
      padding-bottom: 8px;
      color: #333333;
      font-weight: 800;
    }
    .chart {
      width: 100px;
      padding: 0 10px;
    }
    .ring {
      width: 100%;
      height: 60px;
    }
    .info {
      white-space: nowrap;

      border-left: 2px solid #e0eaf2;
      padding-left: 10px;
      padding-right: 20px;
      span {
        color: #1b3c90;
      }
      p {
        font-size: 12px;
        color: #666666;
      }
    }
  }
</style>
