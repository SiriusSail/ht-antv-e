import { Graph, Shape, Addon, Node, Cell, Model } from "@antv/x6";
import { Options as GraphOptions } from "@antv/x6/lib/graph/options";
import dayjs from "dayjs";
import * as Element from "element-plus";
import { GraphTableData, GraphTablePropsStore } from "../../index.d";
import { transformMetadata } from './ErTable';
import "@antv/x6-vue-shape";

const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i += 1) {
    // eslint-disable-next-line no-param-reassign
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}

const { ElMessage } = Element;
export interface NodeOppoPorps {
  title: string;
  options: any[];
}

export type GraphInitOptions = {
  containerId: string;
  /**
   * 画布配置 根据antv-x6文档来修改
   */
};
export default class FlowChart {
  // #region 画布
  graph: Graph;

  // 容器dom Id
  containerId: string;

  // #region 编排图
  private stencil: Addon.Stencil | undefined;

  // #region 初始化图形

  constructor({containerId}: GraphInitOptions) {
    this.containerId = containerId;
    const graphHTMLParent = document.getElementById(this.containerId)!;
    graphHTMLParent.innerHTML = "";
    const graphHTML = document.createElement("div");
    graphHTML.style.width = "100%";
    graphHTML.style.height = "100%";
    graphHTMLParent.appendChild(graphHTML);
    // #region 初始化画布
    this.graph = new Graph({
      container: graphHTML,
      grid: true,
      connecting: {
        allowLoop: false,
        allowBlank: false,
        allowNode: false,
        router: {
          name: 'er',
          args: {
            offset: 25,
            direction: 'H',
          },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
              },
            },
          })
        },
      },
      keyboard: true,
      selecting: {
        enabled: true,
        showNodeSelectionBox: true,
        filter: ['er-table']
      },
      clipboard: true,
      scroller: true,
    });

    this.addKeyEvent();
  }


  autoReSize(size?: { w: number; h: number }) {
    const graphHTML = document.getElementById(this.containerId)!;
    this.graph?.resize(
      size?.w || graphHTML.clientWidth,
      size?.h || graphHTML.clientHeight
    );
  }

  // 抛出实例
  getGraph = () => this.graph;

  // #region 键盘快捷键事件绑定操作
  addKeyEvent() {
    // copy cut paste
    this.graph.bindKey(["meta+c", "ctrl+c"], () => {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.copy(cells);
      }
      return false;
    });
    this.graph.bindKey(["meta+x", "ctrl+x"], () => {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.cut(cells);
      }
      return false;
    });
    this.graph.bindKey(["meta+v", "ctrl+v"], () => {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 });
        this.graph.cleanSelection();
        this.graph.select(cells);
      }
      return false;
    });

    // undo redo
    this.graph.bindKey(["meta+z", "ctrl+z"], () => {
      if (this.graph.history.canUndo()) {
        this.graph.history.undo();
      }
      return false;
    });
    this.graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
      if (this.graph.history.canRedo()) {
        this.graph.history.redo();
      }
      return false;
    });

    // select all
    this.graph.bindKey(["meta+a", "ctrl+a"], () => {
      const nodes = this.graph.getNodes();
      if (nodes) {
        this.graph.select(nodes);
      }
    });

    this.graph.bindKey(["backspace", "delete"], () => {
      const cells = this.graph.getSelectedCells();
      if (cells.length) {
        this.graph.removeCells(cells);
      }
    });

    // zoom
    this.graph.bindKey(["ctrl+1", "meta+1"], () => {
      const zoom = this.graph.zoom();
      if (zoom < 1.5) {
        this.graph.zoom(0.1);
      }
    });
    this.graph.bindKey(["ctrl+2", "meta+2"], () => {
      const zoom = this.graph.zoom();
      if (zoom > 0.5) {
        this.graph.zoom(-0.1);
      }
    });
  }

  // 创建node 节点
  createNode(options: Node.Metadata) {
    return this.graph.createNode(options);
  }

  // 创建左侧元组建
  addStencilItem(options: Node.Metadata[], stencilName: string) {
    this.stencil?.load(
      options.map((item) => this.createNode(item)),
      stencilName
    );
  }

  // 反序列化
  fromJSON(initGraphData: Node.Metadata[]) {
    this.graph.fromJSON(initGraphData);
    // this.graph.getNodes().forEach((item) => {
    //   nodeMiddwarle(item)
    // })
  }

  addGraphTableDataNode(data: GraphTableData[]) {
    const metadata = transformMetadata(data)
    this.graph.addNodes(metadata)
  }

  addTableEdge(data: GraphTablePropsStore.innerJoin) {
    if (data) {
      const edges = data.map((item) => {
        const port = item.colMap
        const [source, target] = item.colMap.split(',')
        const [sourceCell] = source.split(':')
        const [targetCell] = target.split(':')
        return {
          id: port,
          shape: "edge",
          source: {
            cell: sourceCell,
            port: source
          },
          target: {
            cell: targetCell,
            port: target
          },
          attrs: {
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 2
            }
          },
          "zIndex": 0
        }
      })
      this.graph.addEdges(edges)
    }
  }
}
