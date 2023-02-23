<template>
  <div class="flow_chart_wrap">
    <div class="center">
      <div id="graphPreview" class="graph"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  provide,
  watch,
  reactive,
  nextTick,
} from "vue";
// import Graph from '@/components/Graph'
import * as Element from "element-plus";
import { Node, Cell } from "@antv/x6";
import Graph from "@/components/Graph/graph";
import { useRoute } from "vue-router";
import Api from "@/api/DataCard";

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute();
    let graph: Graph = {} as any;

    const curComp = ref("text-shape");

    const intGraph = () => {
      // 创建x6实例
      graph = new Graph({
        containerId: "graphPreview",
        stencilId: "stencilContent",
        minimapId: "minimapContainer",
        nodeMovable: false,
        selecting: false,
      });
    };

    // 获取store数据显示在画布上
    const showNodeOnCanvas = () => {
      graph.graph.fromJSON(JSON.parse(localStorage.getItem("PREVIEW_NODE")));
    };
    const getInfo = async () => {
      const res = await Api.getInfo(route.query.rowId.toString());
      graph.graph.fromJSON(res.result.card_content);
    };

    onMounted(() => {
      intGraph();

      if (route.query.rowId) {
        getInfo();
      } else {
        showNodeOnCanvas();
      }
    });

    // let graphForm: Node.Metadata = [];

    return {
      curComp,
    };
  },
});
</script>

<style lang="scss" scoped>
.flow_chart_wrap {
  height: 100%;
  .center {
    height: 100%;
  }
  .graph {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
}
</style>
