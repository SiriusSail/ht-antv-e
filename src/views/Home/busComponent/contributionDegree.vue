<template>
  <div class="contribution_graph">
    <PromptBoard />
    <div id="x6Container" />
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
  nextTick,
} from "vue";
import PromptBoard from "@/components/FlowChart/PromptBoard.vue";
import FlowChart from "@/components/FlowChart";
import { getedge, getVueCard } from "@/components/FlowChart/x6Component";
import { ApiTargetfield } from "../api/index";

// 加载关系图形
const flowDynamicData: { nodes: any; edges: any } = {
  nodes: [],
  edges: [],
};
let graph: FlowChart;
const graphInit = () => {
  if (graph) {
    graph.dispose();
  }
  const dom = document.getElementById("x6Container");
  if (dom) {
    graph = new FlowChart(dom);
    // graph.fromJSON(flowDefaultData);
    graph.fromJSON(flowDynamicData);
  }
};
// DOM加载完毕
onMounted(() => {
  getTargetfield();
  window.addEventListener("resize", graphInit);
});
onDeactivated(() => {
  window.removeEventListener("resize", graphInit);
});
const height = ref("0px");
// 坐标
const coordinate = [
  { x: 300, y: 40 },
  { x: 540, y: 240 },
  { x: 300, y: 450 },
  { x: 60, y: 240 },
  { x: 540, y: 450 },
  { x: 540, y: 450 },
];

// 指标总览（领域）
const getTargetfield = () => {
  flowDynamicData.nodes = [];
  flowDynamicData.edges = [];
  ApiTargetfield().then((res: any) => {
    if (JSON.stringify(res.result) != "{}") {
      // res.result.nodes.forEach((element: any) => {
      //   res.result.nodes.push({
      //     ...res.result.nodes[0],
      //     rowId: element.rowId + 1,
      //   });
      //   res.result.nodes.push({
      //     ...res.result.nodes[0],
      //     rowId: element.rowId + 2,
      //   });
      //   res.result.nodes.push({
      //     ...res.result.nodes[0],
      //     rowId: element.rowId + 3,
      //   });
      //   res.result.nodes.push({
      //     ...res.result.nodes[0],
      //     rowId: element.rowId + 4,
      //   });
      //   res.result.nodes.push({
      //     ...res.result.nodes[0],
      //     rowId: element.rowId + 5,
      //   });
      // });

      height.value = 100 + Math.ceil(res.result.nodes.length / 3) * 160 + "px";
      let level = 0;
      res.result.nodes.forEach((item: any, index: number): void => {
        const _index = index + 1;

        let x: number = 50;
        let y: number = 100;
        if (_index % 3 == 1) {
          x = 50;
        } else {
          x += ((_index - 1) % 3) * 250;
        }

        y += level * 150;
        if (_index % 3 == 0) {
          level++;
        }
        const tem = getVueCard({
          id: item.rowId,
          x: x,
          y: y,
          data: {
            ...item,
          },
        });
        flowDynamicData.nodes.push(tem);
      });
      res?.result?.relations.forEach(
        (item: RelationsItem, index: number): void => {
          const cur = getedge({
            source: item.fromId,
            target: item.toId,
            label: "贡献度\n" + item.weightVal,
            index: index,
          });
          flowDynamicData.edges.push(cur);
        }
      );
    } else {
      const newData = [
        {
          code: "0",
          domain: "营销指标",
          rowId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f6",
          total: 0,
          totalComplex: 0,
          totalExtend: 0,
          totalOnline: 0,
          totalOrigin: 0,
        },
        {
          code: "1",
          domain: "产品指标",
          rowId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f7",
          total: 0,
          totalComplex: 0,
          totalExtend: 0,
          totalOnline: 0,
          totalOrigin: 0,
        },
        {
          code: "3",
          domain: "研发指标",
          rowId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f8",
          total: 0,
          totalComplex: 0,
          totalExtend: 0,
          totalOnline: 0,
          totalOrigin: 0,
        },
      ];
      const coord = [
        {
          fromId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f8",
          id: 14,
          toId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f6",
          weightVal: 1,
        },
        {
          fromId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f6",
          id: 15,
          toId: "d9b63fb1-275c-4377-8ea4-36e4b02fb5f7",
          weightVal: 1,
        },
      ];

      newData.forEach((item: any, index: number): void => {
        const tem = getVueCard({
          id: item.rowId,
          x: coordinate[index].x,
          y: coordinate[index].y,
          data: {
            ...item,
          },
        });
        flowDynamicData.nodes.push(tem);
      });
      coord.forEach((item: any, index: number): void => {
        const cur = getedge({
          source: item.fromId,
          target: item.toId,
          label: "贡献度\n" + item.weightVal,
          index: index,
        });
        flowDynamicData.edges.push(cur);
      });
    }
    nextTick(() => {
      graphInit();
    });
  });
};
</script>

<style scoped lang="scss">
#x6Container {
  width: 800px;
  height: v-bind(height);
  margin: 0 auto;
}
// .x6-container {
// }
.contribution_graph {
  height: 600px;
  position: relative;
  overflow: auto;
  background-image: url("@/assets/images/background.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
