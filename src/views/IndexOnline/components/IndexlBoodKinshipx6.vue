<template>
  <div>
    <div id="containerId" v-loading="useGetBlood.loading" class="merticsChart">
      <div id="graph" class="graph-class"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watchEffect,
  onMounted,
  nextTick,
} from "vue";
import MyChart from "@/components/Echart/index.vue";
import { Node, Graph, Shape } from "@antv/x6";
import { CustomImage } from "@/components/Graph/CustomImage";
import Api, { Blood } from "../api/index";

Graph.registerNode("imageText", CustomImage, true);

export default defineComponent({
  setup() {
    let graph: Graph;
    const useGetBlood = Api.useGetBlood({
      needInit: false,
    });

    onMounted(() => {
      const graphHTMLParent = document.getElementById("graph")!;

      graph = new Graph({
        container: graphHTMLParent,
        grid: true,
        connecting: {
          allowLoop: false,
          allowBlank: false,
          allowNode: false,
          router: {
            name: "er",
            args: {
              offset: 25,
              direction: "H",
            },
          },
          createEdge() {
            return new Shape.Edge({
              attrs: {
                line: {
                  stroke: "#A2B1C3",
                  strokeWidth: 2,
                },
              },
            });
          },
        },
        clipboard: false,
        scroller: false,
      });
    });

    watchEffect(() => {
      const nodes =
        useGetBlood.data.nodes?.map((item, i) => ({
          shape: "imageText",
          // 还有什么属性可以加在这一层
          id: item.nodeId,
          position: {
            x: 10 + i * 80,
            y: 20,
          },
          attrs: {
            // 这一层可以添加放入其他的数据
            label: {
              // 组件名称
              text: item.nodeName,
            },
            body: {
              // 可以不用要
              stroke: "#CDEAFF",
              fill: "#CDEAFF",
            },
            background: {
              // 可以不用要
              stroke: "#CDEAFF",
              fill: "#CDEAFF",
            },
            image: {
              // 图片地址 svg 格式
              "xlink:href": "/admin/flowChart/icon/card.svg",
            },
          },
          ports: {
            groups: {
              list: {
                position: {
                  position: {
                    x: 0,
                    y: 16,
                  },
                  angle: 0,
                },
              },
            },
            items: [
              {
                id: `${item.nodeId}_port`,
                group: "list",
              },
            ],
          },
        })) || [];

      const edgs =
        useGetBlood.data.relations?.map((item, i) => ({
          id: `port_${i}`,
          shape: "edge",
          source: {
            cell: item.fromId,
            port: `${item.fromId}_port`,
          },
          target: {
            cell: item.toId,
            port: `${item.toId}_port`,
          },
          attrs: {
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 2,
            },
          },
          zIndex: 0,
        })) || [];
      graph?.addNodes(nodes);
      graph?.addEdges(edgs);
    });

    // 请求
    const requset = (rowId: string) => {
      useGetBlood.request(rowId);
    };

    return { requset, useGetBlood };
  },
});
</script>
<style scoped lang="scss">
.merticsChart {
  height: 500px;
  width: 100%;
  .graph-class {
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
