import IndexCard from "./IndexCard.vue";
import PromptBoard from "./PromptBoard.vue";
import Mytable from "@/components/table/index.vue";

// new 一个 vue模板
export const newVue = (components: any, template: string, data: any) => ({
  template,
  data () {
    return data;
  },
  components,
});

/**
 * 提示板
 */
export const initPromptBoard = {
  template: `<prompt-board></prompt-board>`,
  data () {
    return {};
  },
  methods: {},
  components: {
    PromptBoard,
  },
};

// 获取边
export const getedge = (option: {
  source: string;
  target: string;
  label: string;
  index?: number;
  vertices?: { x: number; y: number }[];
}) => ({
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
});

// export const getedge2 = (option: {
//   source: string;
//   target: string;
//   label: string;
//   index?: number;
//   vertices?: { x: number; y: number }[];
// }) => ({
//   source: option.source, // String，必须，起始节点 id
//   target: option.target, // String，必须，目标节点 id
//   router: {
//     name: "manhattan",
//     // args: {
//     //   startDirections: ["bottom"],
//     //   endDirections: ["top"],
//     // },
//     // name: "er",
//     args: {
//       // offset: 1000,
//     },
//     // name: "oneSide",
//     // args: {
//     //   side: "right",
//     //   padding: 50,
//     // },
//   },
//   connector: { name: "normal" },
//   vertices: option.vertices,
//   labels: [
//     {
//       position: {
//         offset: {
//           // x: 20,
//           // y: 20,
//         },
//         options: {
//           // keepGradient: true,
//           ensureLegibility: true,
//         },
//       },
//     },
//   ],
//   attrs: {
//     text: {
//       fill: "#ccc",
//       fontSize: 10,
//     },
//     line: {
//       stroke: "#BDC4D1",
//     },
//   },
// });

// 获取自定义Node
export interface VueCardNode {
  id: number | string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  data: {
    title: string;
    count: number;
    atomic: number;
    composite: number;
    derivative: number;
    state: number;
  };
}
export interface CardNode {
  id: number | string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  data: {
    domain: string; // 标题
    rowId: string;
    total: number; // 总数
    totalComplex: number; // 复合指标
    totalExtend: number; // 衍生指标
    totalOnline: number;
    totalOrigin: number; // 原子指标
  };
}

export const getVueCard = (option: CardNode) => ({
  shape: "vue-shape",
  id: option.id, // String，节点的唯一标识
  x: option.x, // Number，必选，节点位置的 x 值
  y: option.y, // Number，必选，节点位置的 y 值
  width: option.width || 220, // Number，可选，节点大小的 width 值
  height: option.height || 120, // Number，可选，节点大小的 height 值
  component: newVue(
    { IndexCard },
    `<index-card  :isHref="true"  :item="data"></index-card>`,
    {
      data: option.data,
    }
  ),
});

export interface VueTableNode {
  id: number | string;
  x: number | string;
  y: number | string;
  width?: number | string;
  height?: number | string;
  data: any;
}

// 获取表格节点
export const getVueTable = (option: VueTableNode) => {
  return {
    shape: "vue-shape",
    id: option.id, // String，节点的唯一标识
    x: option.x, // Number，必选，节点位置的 x 值
    y: option.y, // Number，必选，节点位置的 y 值
    width: option.width || 220, // Number，可选，节点大小的 width 值
    height: option.height || 120, // Number，可选，节点大小的 height 值
    component: newVue(
      { Mytable },
      `<Mytable  border :data="tableData" :column="tableColumn"></Mytable>`,
      { ...option.data }
    ),
  };
};
