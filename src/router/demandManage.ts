import { RouteRecordRaw } from "vue-router";
import layout from "../layout/index.vue";
import DemandManage from "@/views/DemandManage/index.vue";
import IndexOnline from "@/views/IndexOnline/index.vue";
export const demandManage: Array<RouteRecordRaw> = [
  {
    path: "/demandManage", // 需求管理
    name: "demandManage",
    component: DemandManage,
    redirect: "/demandManage/kanban",
    meta: {
      title: {
        "/zh-CN": "需求管理",
        "/en-US": "Guide Page",
      },
      icon: "el-icon-guide",
    },
    children: [
      {
        path: "/demandManage/dashboard",
        name: "/demandManage/dashboard",
        component: () => import("@/views/DemandManage/views/dashboard.vue"),
        meta: {
          title: {
            "/zh-CN": "效率态势",
            "/en-US": "Guide",
          },
          icon: "",
        },
      },
      {
        path: "/demandManage/kanban",
        name: "/demandManage/kanban",
        component: () => import("@/views/DemandManage/views/kanban.vue"),
        meta: {
          title: {
            "/zh-CN": "需求看板",
            "/en-US": "Guide",
          },
          icon: "",
        },
      },
      {
        path: "/demandManage/standingBook",
        name: "/demandManage/standingBook",
        component: () => import("@/views/DemandManage/views/standingBook.vue"),
        meta: {
          title: {
            "/zh-CN": "需求台账",
            "/en-US": "Guide",
          },
          icon: "",
        },
      },
      {
        path: "/demandManage/scheduling",
        name: "/demandManage/scheduling",
        component: () => import("@/views/DemandManage/views/scheduling.vue"),
        meta: {
          title: {
            "/zh-CN": "开发排期",
            "/en-US": "Guide",
          },
          icon: "",
        },
      },
    ],
  },
  {
    path: "/IndexOnline", // 指标体系
    name: "IndexOnline", // 指标体系
    component: IndexOnline,
    redirect: "/IndexOnline/index", //指标体系
    meta: {
      title: {
        "/zh-CN": "指标体系",
        "/en-US": "Guide Page",
      },
      icon: "el-icon-guide",
    },
    children: [
      {
        path: "/indexonline/index",
        name: "/indexonline/index",
        component: () =>
          import("@/views/IndexOnline/components/IndexOnline.vue"),
        meta: {
          title: {
            "/zh-CN": "指标体系",
            "/en-US": "Guide",
          },
          icon: "",
        },
      },
      {
        path: "/indexonline/indexmap",
        name: "/indexonline/indexmap",
        component: () => import("@/views/IndexOnline/components/IndexMap.vue"),
        meta: {
          title: {
            "/zh-CN": "指标地图",
            "/en-US": "Guide",
          },
          icon: "",
        },
      },
    ],
  },
];
