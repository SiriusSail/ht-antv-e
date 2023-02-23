import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import layout from "../layout/index.vue";
import { hwRoutes } from "./hwRouter";
import flowchartRouter from "./flowchartRouter";
import { demandManage } from "./demandManage";

// 静态路由
export const constantRoutes: Array<RouteRecordRaw> = [
  ...hwRoutes,
  ...demandManage,
  ...flowchartRouter,
  {
    path: "/",
    component: layout,
    redirect: "/digitalMarketing",
    meta: {
      title: {
        "/zh-CN": "首页",
        "/en-US": "Home Page",
      },
      icon: "el-icon-s-home",
    },
    children: [
      {
        path: "/digitalMarketing",
        name: "digital-marketing",
        component: () =>
          import(
            /* webpackChunkName: "digitalMarketing" */ "@/views/Home/digitalMarketing.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "数字经营",
            "/en-US": "digital marketing Page",
          },
          icon: "home",
        },
      },
      {
        path: "/managementAndOperation",
        name: "managementAndOperation",
        component: () =>
          import(
            /* webpackChunkName: "managementAndOperation" */ "@/views/Home/managementAndOperation.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "管理运营",
            "/en-US": "managementAndOperation Page",
          },
          icon: "home",
        },
      },
      {
        path: "/indicatorsOfDevelopment",
        name: "indicatorsOfDevelopment",
        component: () =>
          import(
            /* webpackChunkName: "indicatorsOfDevelopment" */ "@/views/Home/indicatorsOfDevelopment.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "数据开发",
            "/en-US": "IndicatorsOfDevelopment Page",
          },
          icon: "home",
        },
      },
      {
        path: "/Empowerment",
        name: "Empowerment",
        component: () =>
          import(
            /* webpackChunkName: "Empowerment" */ "@/views/Empowerment/index.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "我的赋能",
            "/en-US": "Home Page",
          },
          icon: "home",
        },
      },
      {
        path: "/DataCard",
        name: "DataCard",
        component: () =>
          import(
            /* webpackChunkName: "DataCard" */ "@/views/DataCard/index.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "数据卡片",
            "/en-US": "Home Page",
          },
          icon: "home",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "登录",
    component: () =>
      import(/* webpackChunkName: "login" */ "@/views/Login/index.vue"),
    meta: {
      title: {
        "/zh-CN": "登录",
        "/en-US": "Login",
      },
      hidden: true,
      hiddenTab: true,
    },
  },
  {
    path: "/personal",
    component: layout,
    redirect: "/personal/personalCenter",
    meta: {
      title: {
        "/zh-CN": "个人页",
        "/en-US": "Personal Page",
      },
      icon: "el-icon-user-solid",
    },
    children: [
      {
        path: "/personal/personalCenter",
        name: "personalCenter",
        component: () =>
          import(
            /* webpackChunkName: "personalCenter" */ "@/views/Personal/personalCenter.vue"
          ),
        meta: {
          title: {
            "/zh-CN": "个人中心",
            "/en-US": "PersonalCenter",
          },
          icon: "el-icon-user-solid",
        },
      },
    ],
  },
  // {
  //   path: "/help",
  //   component: layout,
  //   redirect: "/myhelp",
  //   meta: {
  //     title: {
  //       "/zh-CN": "我的求助",
  //       "/en-US": "Guide Page",
  //     },
  //     icon: "el-icon-guide",
  //   },
  //   children: [
  //     {
  //       path: "/myhelp",
  //       name: "myHelp",
  //       component: () =>
  //         import(/* webpackChunkName: "myHelp" */ "@/views/help/myHelp.vue"),
  //       meta: {
  //         title: {
  //           "/zh-CN": "我的求助",
  //           "/en-US": "Home Page",
  //         },
  //         icon: "home",
  //       },
  //     },
  //     {
  //       path: "/mySeekHelp",
  //       name: "mySeekHelp",
  //       component: () => import("@/views/help/mySeekHelp.vue"),
  //       meta: {
  //         hidden: true,
  //         title: {
  //           "/zh-CN": "发起求助",
  //           "/en-US": "dome page",
  //         },
  //         icon: "home",
  //       },
  //     },
  //     {
  //       path: "/messageInfo",
  //       name: "messageInfo",
  //       component: () => import("@/views/help/messageInfo.vue"),
  //       meta: {
  //         hidden: true,
  //         keepAlive: true,
  //         title: {
  //           "/zh-CN": "求助详情",
  //           "/en-US": "dome page",
  //         },
  //         icon: "home",
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: "/flowchart/canvasPreview",
  //   name: "preview",
  //   component: () => import("@/views/FlowChart/canvasPreview.vue"),
  //   meta: {
  //     title: {
  //       "/zh-CN": "指标卡片预览",
  //       "/en-US": "Index Card Preview",
  //     },
  //     icon: "el-icon-guide",
  //   },
  // },
  {
    path: "/noFound",
    name: "NoFound",
    component: () =>
      import(/* webpackChunkName: "noFound" */ "@/views/noFound.vue"),
    meta: {
      title: {
        "/zh-CN": "404",
        "/en-US": "404",
      },
      hidden: true,
      hiddenTab: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () =>
      import(/* webpackChunkName: "noFound" */ "@/views/noFound.vue"),
    meta: {
      title: {
        "/zh-CN": "未找到",
        "/en-US": "NOT FOUND",
      },
      hidden: true,
      hiddenTab: true,
    },
  },
];

// 异步路由
export const asyncRoutes: Array<RouteRecordRaw> = [
  ...hwRoutes,
  ...demandManage,
  ...flowchartRouter,

  {
    path: "/help",
    name: "help",
    component: layout,
    redirect: "/myhelp",
    meta: {
      title: {
        "/zh-CN": "我的求助",
        "/en-US": "Guide Page",
      },
      icon: "el-icon-guide",
    },
    children: [
      {
        path: "/myhelp",
        name: "myHelp",
        component: () =>
          import(/* webpackChunkName: "myHelp" */ "@/views/help/myHelp.vue"),
        meta: {
          title: {
            "/zh-CN": "我的求助",
            "/en-US": "Home Page",
          },
          icon: "home",
        },
      },
      {
        path: "/mySeekHelp",
        name: "mySeekHelp",
        component: () => import("@/views/help/mySeekHelp.vue"),
        meta: {
          hidden: true,
          title: {
            "/zh-CN": "发起求助",
            "/en-US": "dome page",
          },
          icon: "home",
        },
      },
      {
        path: "/messageInfo",
        name: "messageInfo",
        component: () => import("@/views/help/messageInfo.vue"),
        meta: {
          hidden: true,
          keepAlive: true,
          title: {
            "/zh-CN": "求助详情",
            "/en-US": "dome page",
          },
          icon: "home",
        },
      },
    ],
  },
  {
    path: "/flowchart/canvasPreview",
    name: "preview",
    component: () => import("@/views/FlowChart/canvasPreview.vue"),
    meta: {
      title: {
        "/zh-CN": "指标卡片预览",
        "/en-US": "Index Card Preview",
      },
      icon: "el-icon-guide",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  scrollBehavior: () => ({
    top: 0,
  }),
  routes: constantRoutes,
});

export default router;
