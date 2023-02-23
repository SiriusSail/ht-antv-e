import { RouteRecordRaw } from "vue-router";

import Management from "@/views/IndexCenter/index.vue";
import Manage from "@/views/IndexCenter/views/route.vue";
import sys from "@/views/sys/index.vue";

export const hwRoutes: Array<RouteRecordRaw> = [
  {
    path: "/sys",
    name: "sys",
    component: sys,
    redirect: "/Role/roleManage",
    meta: {
      title: {
        "/zh-CN": "系统设置",
        "/en-US": "Home Page",
      },
      icon: "el-icon-s-home",
    },
    children: [
      {
        path: "/Role/roleManage",
        name: "roleManage",
        component: () =>
          import(
            /* @/views/Menu/menuManage.vueichText" */ "@/views/Role/rolesManage.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "角色管理",
            "/en-US": "Role Manage",
          },
          icon: "ic ic-other",
        },
      },
      {
        path: "/Menu/menuEdit",
        name: "menuEdit",
        component: () =>
          import(
            /* @/views/Menu/menuManage.vueichText" */ "@/views/Menu/menuManage.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "菜单管理",
            "/en-US": "Menu Manage",
          },
          icon: "ic ic-other",
        },
      },
      {
        path: "/user",
        name: "user",
        component: () =>
          import(
            /* @/views/Menu/menuManage.vueichText" */ "@/views/user/index.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "用户管理",
            "/en-US": "Menu Manage",
          },
          icon: "ic ic-other",
        },
      },
      {
        path: "/Menu/dictionariesManage",
        name: "dictionariesManage",
        component: () =>
          import(
            /* webpackChunkName: "myHelp" */ "@/views/dictionaries/index.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "字典管理",
            "/en-US": "Home Page",
          },
          icon: "ic ic-other",
        },
      },
      {
        path: "/Menu/RuleCoding",
        name: "RuleCoding",
        component: () =>
          import(
            /* webpackChunkName: "myHelp" */ "@/views/RuleCoding/index.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "编码规则管理",
            "/en-US": "Home Page",
          },
          icon: "ic ic-other",
        },
      },
      {
        path: "/flowchart/data-source",
        name: "dataSource",
        component: () => import("@/views/FlowChart/dataSource"),
        meta: {
          title: {
            "/zh-CN": "数据源",
            "/en-US": "Data Source",
          },
          icon: "ic ic-other",
        },
      },
      {
        path: "/log",
        name: "log",
        component: () => import("@/views/log/index.vue"),
        meta: {
          title: {
            "/zh-CN": "日志",
            "/en-US": "log",
          },
          icon: "ic ic-other",
        }
      }
    ]
  }
];

export default {};
