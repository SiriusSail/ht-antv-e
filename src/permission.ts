import router, { constantRoutes, asyncRoutes } from './router';
import { RouteRecordRaw } from 'vue-router';
import Service from "./api/index";
import useRolesStore from "./store/role";

// import.meta.globEager('./components/**/*.vue')
// const modules = import.meta.globEager("../views/**/*.vue");

router.beforeEach(async (to, from, next) => {
  if (to.query['cas-token']) {
    const token: any = to.query['cas-token']//获取url中"?"符后的字串
    sessionStorage.setItem('token', token)
  }
  const rolesStore = useRolesStore()
  if (rolesStore.routers.length === 0) {
    const data = await Service.sysMenuAuth()
    // 动态添加路由
    if (data.result.length > 0) {

      const authedRoutes = data.result;
      // 过滤只显示授权菜单
      let accessedRoutes: RouteRecordRaw[] = [];
      // authedRoutes.map((item: any) => {
      //   const newItem: any = {
      //     path: "", name: "", component: '', redirect: "",
      //     meta: {
      //       title: { "/zh-CN": "", "/en-US": "", },
      //       icon: "",
      //     },
      //     children: []
      //   }
      //   newItem['path'] = item.routePath || ''
      //   newItem['name'] = item.componentCode || ''
      //   // newItem['component'] = import.meta.globEager(`${item.componentPath}`) //modules[`${item.componentPath}`]
      //   newItem['redirect'] = item.redirect || ''
      //   newItem['meta']['title']['/zh-CN'] = item.menuName || ''
      //   newItem['meta']['title']['/en-US'] = item.menuCode || ''
      //   newItem['meta']['icon'] = item.icon || ''
      //   if (item.children) {
      //     item.children.map((it: any) => {
      //       const chilItem: any = {
      //         path: "", name: "", component: '', redirect: "",
      //         meta: {
      //           title: { "/zh-CN": "", "/en-US": "", },
      //           icon: "",
      //         },
      //         children: []
      //       }
      //       chilItem['path'] = it.routePath || ''
      //       chilItem['name'] = it.componentCode || ''
      //       // chilItem['component'] = import.meta.globEager(it.componentPath)//modules[`${it.componentPath}`]
      //       // it['redirect'] = it.redirect
      //       chilItem['meta']['title']['/zh-CN'] = it.menuName || ''
      //       chilItem['meta']['title']['/en-US'] = it.menuCode || ''
      //       chilItem['meta']['icon'] = it.icon || ''
      //       newItem.children.push(chilItem)
      //     })
      //     accessedRoutes.push(newItem)
      //   } else {
      //     accessedRoutes.push(newItem)
      //   }
      // })


      for (const it of authedRoutes) {
        for (const item of asyncRoutes) {
          if (item.path === it.routePath) {
            let newItem: any = {
              path: "", name: "", component: '', redirect: "",
              meta: {
                title: { "/zh-CN": "", "/en-US": "", },
                icon: "",
              },
              children: []
            }
            newItem['path'] = item.path
            newItem['name'] = item.name
            newItem['component'] = item.component
            newItem['redirect'] = item.redirect
            newItem['meta']['title']['/zh-CN'] = it.menuName
            newItem['meta']['title']['/en-US'] = it.menuCode
            newItem['meta']['icon'] = it.icon

            if (it.children) {
              for (const itc of it.children) {
                for (const itemc of item.children) {
                  if (itemc.path === itc.routePath) {
                    const chilItem: any = {
                      path: "", name: "", component: '', redirect: "",
                      meta: {
                        title: { "/zh-CN": "", "/en-US": "", },
                        icon: "",
                      },
                      children: []
                    }

                    chilItem['path'] = itc.routePath || ''
                    chilItem['name'] = itc.componentCode || ''
                    chilItem['component'] = itemc.component//modules[`${it.componentPath}`]
                    // it['redirect'] = it.redirect
                    chilItem['meta']['title']['/zh-CN'] = itc.menuName || ''
                    chilItem['meta']['title']['/en-US'] = itc.menuCode || ''
                    chilItem['meta']['icon'] = itc.icon || ''
                    newItem.children.push(chilItem)
                  }
                }
              }
            }
            accessedRoutes.push(newItem);
          }
        }
      }

      accessedRoutes.forEach((route: RouteRecordRaw) => {
        const routeName: any = route.name;
        if (!router.hasRoute(routeName)) {
          router.addRoute(route);
        }
      });
      rolesStore.routers = accessedRoutes;
      // console.log(rolesStore.routers);
      router.options.routes = [...asyncRoutes, ...constantRoutes];
      next({
        path: to.path,
        query: to.query
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
router.afterEach(() => {
});
