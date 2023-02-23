/*
 *指标模型类
 */
import { Graph } from "@antv/x6";

import "@antv/x6-vue-shape";

import DataCard from "./DataCard.vue";
import DataTable from "./DataTable.vue";
import DataFormula from "./DataFormula.vue";
import DataImg from "./DataImg.vue";
type Render = {
  id: number | string;
  x: number;
  y: number;
  width: number | string;
  height: number | string;
  data: any;
};

export default class IndexModel {
  graph: Graph;

  constructor() {}
  newIndexMode(container: HTMLElement, options?: any) {
    this.graph = new Graph({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      history: false, // 启动历史记录
      autoResize: true, // 兼容容器改变大小
      interacting: {
        nodeMovable: false, // 禁止拖拽
      },
      preventDefaultContextMenu: false,
      connecting: {
        allowBlank: true,
      },
      background: {
        color: "#ffffff",
      },
      ...options,
    });
  }
  resize(w: number, h: number) {
    this.graph.resize(w, h);
  }
  //渲染数据
  fromJSON(data: any) {
    this.graph.fromJSON(data);
  }
  //渲染卡片
  renderCard(option: Render) {
    return {
      shape: "vue-shape",
      id: option.id, // String，节点的唯一标识
      x: option.x, // Number，必选，节点位置的 x 值
      y: option.y, // Number，必选，节点位置的 y 值
      width: option.width, // Number，可选，节点大小的 width 值
      height: option.height, // Number，可选，节点大小的 height 值
      component: {
        template: `<DataCard :name='name'  ></DataCard>`,
        data() {
          return option.data;
        },
        components: {
          DataCard,
        },
      },
    };
  }
  // 渲染表格
  renderTable(option: Render) {
    return {
      shape: "vue-shape",
      id: option.id, // String，节点的唯一标识
      x: option.x, // Number，必选，节点位置的 x 值
      y: option.y, // Number，必选，节点位置的 y 值
      width: option.width, // Number，可选，节点大小的 width 值
      height: option.height, // Number，可选，节点大小的 height 值

      component: {
        template: `<DataTable  border :data="tableData" :height="height" cell-class-name="cellClass" :column="tableColumn"></DataTable>`,
        data() {
          return option.data;
        },
        components: {
          DataTable,
        },
      },
    };
  }
  //渲染公式

  renderFormula(option: Render) {
    return {
      shape: "vue-shape",
      id: option.id, // String，节点的唯一标识
      x: option.x, // Number，必选，节点位置的 x 值
      y: option.y, // Number，必选，节点位置的 y 值
      width: option.width, // Number，可选，节点大小的 width 值
      height: option.height, // Number，可选，节点大小的 height 值
      component: {
        template: `<DataFormula :value="value"></DataFormula>`,
        data() {
          return option.data;
        },
        components: {
          DataFormula,
        },
      },
    };
  }

  //渲染图片
  renderImg(option: Render) {
    return {
      shape: "vue-shape",
      id: option.id, // String，节点的唯一标识
      x: option.x, // Number，必选，节点位置的 x 值
      y: option.y, // Number，必选，节点位置的 y 值
      width: option.width, // Number，可选，节点大小的 width 值
      height: option.height, // Number，可选，节点大小的 height 值
      component: {
        template: `<DataImg :img="value"></DataImg>`,
        data() {
          return option.data;
        },
        components: {
          DataImg,
        },
      },
    };
  }

  //渲染边
  renderEdge(option: {
    source: string;
    target: string;
    label?: string;
    index?: number;
    vertices?: { x: number; y: number }[];
  }) {
    return {
      source: option.source, // String，必须，起始节点 id
      target: option.target, // String，必须，目标节点 id
      router: {
        // name: "manhattan",
        // args: {
        //   startDirections: ["bottom"],
        //   endDirections: ["top"],
        // },
        // name: "er",
        args: {
          // offset: 1000,
        },
        // name: "oneSide",
        // args: {
        //   side: "right",
        //   padding: 50,
        // },
      },
      connector: { name: "normal" },
      vertices: option.vertices,
      labels: [
        {
          position: {
            offset: {
              // x: 20,
              // y: 20,
            },
            options: {
              // keepGradient: true,
              ensureLegibility: true,
            },
          },
        },
      ],
      attrs: {
        text: {
          fill: "#ccc",
          fontSize: 10,
        },
        line: {
          stroke: "#BDC4D1",
        },
      },
    };
  }

  dispose() {
    this.graph?.dispose();
  }
  //创建table 表格
}
