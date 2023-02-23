import { RouteRecordRaw } from "vue-router";

import layout from "@/layout/Flowchart.vue";

const flowchartRouter: Array<RouteRecordRaw> = [
  {
    path: "/flowchart",
    name: "flowchart",
    component: layout,
    redirect: "/flowchart",
    meta: {
      title: {
        "/zh-CN": "流程图",
        "/en-US": "Guide Page",
      },
      icon: "el-icon-guide",
    },
    children: [
      {
        path: "/flowchart/data-assets",
        name: "dataAssets",
        component: () => import("@/views/FlowChart/dataAssets"),
        meta: {
          title: {
            "/zh-CN": "数据源",
            "/en-US": "Data Assets",
          },
          icon: "icon-a-dataassets",
        },
      },
      // {
      //   path: "/flowchart/data-card",
      //   name: "dataCard",
      //   component: () => import("@/views/FlowChart/dataCard"),
      //   meta: {
      //     title: {
      //       "/zh-CN": "数据卡片",
      //       "/en-US": "Data Card",
      //     },
      //     icon: "icon-datacard",
      //   },
      // },

      {
        path: "/flowchart/index/:rowid?",
        name: "flowChart",
        component: () => import("@/views/FlowChart/index"),
        meta: {

          title: {
            "/zh-CN": "指标配置",
            "/en-US": "Flow Chart",
          },
          icon: "icon-a-dataexploit",
        },
      },
      {
        path: "/flowchart/index-card",
        name: "indexCard",
        component: () => import("@/views/FlowChart/zhiBiaoCard.vue"),
        meta: {
          title: {
            "/zh-CN": "数据卡片",
            "/en-US": "Index Card",
          },
          icon: "icon-a-indexcard",
        },
      },
    ],
  }
];

export default flowchartRouter