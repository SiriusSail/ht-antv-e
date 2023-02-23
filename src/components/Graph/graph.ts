import { Graph, Shape, Addon, Node, Cell, Model, DataUri } from "@antv/x6";
import { Options as GraphOptions } from "@antv/x6/lib/graph/options";
import dayjs from "dayjs";
import * as Element from "element-plus";
import {
  graphDefaultOptions,
  stencilDefaultOptions,
  ports,
} from "./graphInitConfig";
import { showPorts } from "./graphUtils";
import { CustomImage } from "./CustomImage";
import { CustomText } from "./CustomText";
import "./EchartShape";
import "./TextShape";
import "@antv/x6-vue-shape";

const { ElMessage } = Element;

Graph.registerNode("imageText", CustomImage, true);
// 创建模型 图文呢模型
Graph.registerNode("customText", CustomText, true);
// 节点圆形的配置组
export interface NodeOppoPorps {
  title: string;
  options: any[];
}

// 左侧配置项
interface StencilOptions extends Partial<typeof stencilDefaultOptions> {
  nodeOppoOption: NodeOppoPorps[];
}

export type GraphInitOptions = {
  /**
   * 画布Id
   */
  containerId: string;
  /**
   * 画布配置 根据antv-x6文档来修改
   */

  graphOptions?: Partial<GraphOptions.Manual>;
  /**
   * 小地图Id
   */

  minimapId?: string;
  /**
   * 编排图Id
   */

  stencilId?: string;
  // /**
  //  * 编排配置 根据antv-x6文档来修改
  // */
  // stencilOptions?: StencilOptions,
  grid?: boolean;
  nodeMovable?: boolean; //禁止拖动节点
  selecting?: boolean; //禁止框选
  // /**
  //  * 编排配置 根据antv-x6文档来修改
  // */
  // stencilOptions?: StencilOptions,
};
export default class FlowChart {
  // #region 画布
  graph: Graph;

  // 容器dom Id
  containerId: string;

  // #region 编排图
  private stencil: Addon.Stencil | undefined;

  private stencilDiv;

  // #region 初始化图形

  constructor({
    graphOptions,
    containerId,
    stencilId,
    minimapId,
    grid = true,
    nodeMovable = true,
    selecting = true,
  }: GraphInitOptions) {
    let miniOptions: any = {};
    this.containerId = containerId;
    const graphHTMLParent = document.getElementById(this.containerId)!;
    if (stencilId) {
      this.stencilDiv = document.getElementById(stencilId);
    }
    graphHTMLParent.innerHTML = "";
    const graphHTML = document.createElement("div");
    graphHTML.style.width = "100%";
    graphHTML.style.height = "100%";
    graphHTMLParent.appendChild(graphHTML);
    if (minimapId) {
      const minimapHTML = document.getElementById(minimapId);
      const width = minimapHTML?.clientWidth;
      const height = minimapHTML?.clientHeight;
      miniOptions = {
        enabled: true,
        container: minimapHTML,
        width: width!,
        height: height!,
        panning: {
          enabled: true,
          modifiers: "shift",
        },
        padding: 10,
        graphOptions: {
          async: true,
          createCellView: (cell: any) => {
            if (cell.isEdge()) {
              return null;
            }
          },
        },
      };
    }
    // #region 初始化画布
    this.graph = new Graph({
      panning: false,
      container: graphHTML,
      highlighting: {
        magnetAdsorbed: {
          name: "stroke",
          args: {
            attrs: {
              fill: "#5F95FF",
              stroke: "#5F95FF",
            },
          },
        },
      },
      resizing: false,
      rotating: false,
      ...graphDefaultOptions,
      grid,
      minimap: minimapId ? miniOptions : false,
      ...graphOptions,

      interacting: {
        nodeMovable: nodeMovable, // 禁止拖拽
        edgeLabelMovable: false,
      },
    });
    this.graph.lockScroller();

    this.addKeyEvent();

    this.bindGraphEvent(containerId);
    if (!selecting) {
      this.graph.disableSelection(); //禁止框选
    }

    // this.addStencilItem()
    // this.upDateStencil(stencilOptions)
  }

  upDateStencil(stencilOptions: StencilOptions) {
    const { nodeOppoOption, ...options } = stencilOptions;
    // #region 初始化 编排图
    this.stencil = new Addon.Stencil({
      ...stencilDefaultOptions,
      ...options,
      groups:
        nodeOppoOption?.map((item) => ({
          title: item.title,
          name: item.title,
          graphHeight:
            Math.ceil(
              (item.options?.length /
                (stencilOptions.layoutOptions?.columns || 4)) as number
            ) *
              60 +
            10,
          layoutOptions: {
            rowHeight: 50,
          },
        })) || stencilDefaultOptions.groups,
      target: this.graph,
      getDropNode: (node) => {
        // console.log('drop', node)
        let cloneNode;
        switch (node.shape) {
          case "customText":
            if (node.attrs.label.text === "静态") {
              cloneNode = this.graph.createNode({
                shape: "text-shape",
                attrs: {
                  option: {
                    title: "静态",
                    content: "",
                    flowId: "",
                    type: "静态",
                  },
                },
              });
            } else {
              cloneNode = this.graph.createNode({
                shape: "text-shape",
                attrs: {
                  option: {
                    title: "动态",
                    content: "",
                    flowId: "",
                    type: "动态",
                  },
                },
              });
            }
            break;
          default:
            cloneNode = node.clone();
        }

        return cloneNode;
      },
    });
    nodeOppoOption?.forEach((item) => {
      this.addStencilItem(item.options, item.title);
    });

    this.appendStencil();
  }

  autoReSize(size?: { w: number; h: number }) {
    const graphHTML = document.getElementById(this.containerId)!;
    console.log(graphHTML.clientWidth, graphHTML.clientHeight);
    this.graph?.resize(
      size?.w || graphHTML.clientWidth,
      size?.h || graphHTML.clientHeight
    );
  }

  // 添加编排图
  appendStencil() {
    // eslint-disable-next-line no-unused-expressions
    this.stencil && this.stencilDiv!.appendChild(this.stencil.container);
  }

  // 抛出实例
  getGraph = () => this.graph;

  // 获取上个
  updateRelationship = async (cell: CustomImage) => {
    if (!cell.graphForm) {
      return [];
    }
    // CustomImage
    if (this.graph.isRootNode(cell)) {
      // cell.graphForm.setIninValue();
      return cell.graphForm.format();
      // return new Promise((resolve, reject) => {
      //   const params = Object.entries(cell.attrs.params).map(async ([key, item2]: [string, any]) => {
      //     if (item2.upDateTime) {
      //       const isBeOverdue = dayjs(item2.upDateTime).diff(new Date(), 'seconds')
      //       if (isBeOverdue < 0) {
      //         return (cell.attrs as any).stepValue(key)
      //       }
      //       return ''
      //     }
      //     return '';
      //   });
      //   Promise.all(params).then(async () => {
      //     const d = (await (cell.attrs as any).getValue())
      //     resolve(d);
      //   }).catch(reject)
      // })
    }

    // const Edges = this.graph.getEdges();
    // console.log(Edges)

    // 获取所有的邻居节点
    const inNeighbors = this.graph.getNeighbors(cell, {
      incoming: true,
    }) as CustomImage[];
    // 拿到它们的值
    const data = inNeighbors.map((item) => this.updateRelationship(item));
    const contextData: any[] = await (await Promise.all(data)).flat();

    // 然后设置到自己的初始数据中
    cell.graphForm.setIninValue(contextData);

    return cell.graphForm.format();
  };

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

    // delete
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

  // 绑定连线事件
  bindGraphEvent(containerId: string) {
    // this.graph.on('node:added', ({ cell, index, options }) => {
    //   nodeMiddwarle(cell)
    // })
    this.graph.on("scale", ({ sx, sy, ox, oy }) => {
      if (sx === 1 && sy === 1) {
        this.graph.lockScroller();
      } else {
        this.graph.unlockScroller();
      }
    });

    this.graph.on("node:mouseenter", () => {
      const container = document.getElementById(containerId)!;
      const ports1 = container.querySelectorAll(
        ".x6-port-body"
        // eslint-disable-next-line no-undef
      ) as NodeListOf<SVGElement>;
      showPorts(ports1, true);
    });
    this.graph.on("node:mouseleave", () => {
      const container = document.getElementById(containerId)!;
      const ports2 = container.querySelectorAll(
        ".x6-port-body"
        // eslint-disable-next-line no-undef
      ) as NodeListOf<SVGElement>;
      showPorts(ports2, false);
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

  // 序列化
  toJSON(option: { isValiDate: boolean }) {
    const cells = this.graph.getNodes() as unknown as CustomImage[];
    let version = 0;
    const errorCells = cells.filter((cell) => {
      const necessary = cell.graphForm.necessary();
      version += cell.graphForm.getVersion();
      if (necessary.code === 0) {
        cell.graphForm.setAttributes(necessary.params);
      }
      return necessary.code === 1;
    });
    if (errorCells.length > 0 && option.isValiDate) {
      const necessary = errorCells[0].graphForm.necessary();
      if (necessary.code === 1) {
        ElMessage.error(necessary.message);
        return {
          success: false,
          version,
          json: this.graph.toJSON()
        };
      }
    }
    return {
      version,
      success: true,
      json: this.graph.toJSON()
    };
  }

  getRelationship(cell: Cell.Properties) {
    const { cells } = this.graph.toJSON();
    const edgeList = cells.filter((item) => item.shape === "edge");

    const superior = edgeList
      .filter((item) => item.source.cell === cell.id)
      .map((item) => item.id);
    const subordinate = edgeList
      .filter((item) => item.target.cell === cell.id)
      .map((item) => item.id);

    const newCell = {
      ...cell,
      attrs: {
        ...cell.attrs,
        superior,
        subordinate,
      },
    };
    return newCell as any as Cell.Properties;
  }

  isEmpty() {
    const nodes = this.graph.toJSON();
    return nodes.cells.length === 0;
  }

  // 序列化Json树
  getTreeJSON() {
    const { cells } = this.graph.toJSON();
    const cellList = cells.filter((item) => item.shape === "imageText");
    return cellList.map((item) => this.getRelationship(item));
  }

  getZoom() {
    return this.graph.zoom();
  }
}
