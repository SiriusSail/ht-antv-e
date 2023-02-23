import { Graph, Line, Path, Curve } from "@antv/x6";

import "@antv/x6-vue-shape";

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

export default class X6Chart {
  graph: Graph;

  constructor(container: HTMLElement, options?: any) {
    this.graph = new Graph({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
      history: false, // 启动历史记录
      // autoResize: true, // 兼容容器改变大小
      interacting: {
        nodeMovable: false, // 禁止拖拽
      },
      connecting: {
        allowBlank: true,
      },
      // background: {
      //   color: "#ffffff",
      // },
      background: false,
      ...options,
    });
  }

  fromJSON (data: any) {
    this.graph.fromJSON(data);
  }

  // 销毁画布
  dispose () {
    this.graph.dispose();
  }
}
