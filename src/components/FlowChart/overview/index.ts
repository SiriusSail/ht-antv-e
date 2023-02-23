import { Graph, Line, Path, Curve } from "@antv/x6";

import "@antv/x6-vue-shape";
import IndexCard from "../IndexCard.vue";
// 自定义 弧线
Graph.registerConnector(
  "multi-smooth",
  (
    sourcePoint,
    targetPoint,
    routePoints,
    options: { raw?: boolean; index?: number; total?: number; gap?: number }
  ) => {
    let index;
    if (targetPoint.x < sourcePoint.x) {
      index = 4;
      if (targetPoint.y < sourcePoint.y) {
        index = 4;
      } else {
        index = 10;
      }
    } else if (targetPoint.x === sourcePoint.x) {
      index = 10;
    } else {
      index = 10;
      if (targetPoint.y > sourcePoint.y) {
        index = 4;
      } else if (targetPoint.y === sourcePoint.y) {
        index = 10;
      } else {
        index = 10;
      }
    }
    const total = 15;
    const gap = 12;

    const line = new Line(sourcePoint, targetPoint);
    const centerIndex = (total - 1) / 2;
    const dist = index - centerIndex;
    const diff = Math.abs(dist);
    const factor = diff === 0 ? 1 : diff / dist;
    const vertice = line
      .pointAtLength(line.length() / 2 + (gap / 2) * factor * Math.ceil(diff))
      .rotate(90, line.getCenter());

    const points = [sourcePoint, vertice, targetPoint];
    const curves = Curve.throughPoints(points);
    const path = new Path(curves);
    return options.raw ? path : path.serialize();
  },
  true
);

type Render = {
  id: number | string;
  x: number;
  y: number;
  width?: number | string;
  height?: number | string;
  data: any;
};

export default class Overview {
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

  // 获取边
  renderEdge(option: {
    source: string;
    target: string;
    label: string;
    index?: number;
    vertices?: { x: number; y: number }[];
  }) {
    return {
      source: option.source, // String，必须，起始节点 id
      target: option.target, // String，必须，目标节点 id
      router: {
        name: "manhattan",
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
      connector: {
        name: "multi-smooth",
        args: {
          total: 15,
          index: 10,
        },
      },
      vertices: option.vertices,
      labels: [
        {
          markup: [
            {
              tagName: "rect",
              selector: "labelBody",
            },
            {
              tagName: "text",
              selector: "labelText",
            },
          ],
          attrs: {
            labelText: {
              text: option.label,
              fill: "#ccc",
              fontSize: 12,
              textAnchor: "middle",
              textVerticalAnchor: "middle",
            },
            labelBody: {
              ref: "labelText",
            },
          },
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
      markup: [
        {
          tagName: "path",
          selector: "fill",
        },
        {
          tagName: "text",
          selector: "label",
        },
      ],
      attrs: {
        text: {
          fill: "#ccc",
          fontSize: 10,
        },
        fill: {
          connection: true,
          strokeWidth: 2,
          strokeLinecap: "round",
          fill: "none",
          // 线条
          stroke: {
            type: "linearGradient",
            stops: [
              { offset: "0%", color: "#fff" },
              { offset: "100%", color: "#5B8FF9" },
            ],
          },
          // 箭头
          targetMarker: {
            fill: "#5B8FF9",
            tagName: "path",
            d: "M 10 -5 0 0 10 5 z",
          },
        },
      },
    };
  }

  renderCard(option: Render) {
    return {
      shape: "vue-shape",
      id: option.id, // String，节点的唯一标识
      x: option.x, // Number，必选，节点位置的 x 值
      y: option.y, // Number，必选，节点位置的 y 值
      width: option.width || 220, // Number，可选，节点大小的 width 值
      height: option.height || 120, // Number，可选，节点大小的 height 值
      component: {
        template: `<IndexCard :item="data"></IndexCard>`,
        data() {
          return option.data;
        },
        components: {
          IndexCard,
        },
      },
    };
  }

  fromJSON(data: any) {
    this.graph.fromJSON(data);
  }

  // 销毁画布
  dispose() {
    this.graph?.dispose();
  }
}
