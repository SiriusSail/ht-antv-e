# vue3.0-template-admin

# 安装依赖

```bash
yarn
#or
npm install
```

# 启动服务

```
yan dev
```

# 打包

```
yarn build
```

# 运行

```
yarn serve
```

# 生成 IconFont

```bash
## url 必传 阿里云路径.css
## path 非必要 本地下载路径，文件夹必须有 默认路径 src/components/Iconfont
## 示例: yarn upDateIcon //at.alicdn.com/t/font_2886047_sfhgddab88c.css

yarn upDateIcon url path
```

# 开发注意事项

## css

- 统一使用 css 使用 XXX.module.[css | scss] 命名文件

- 引入方式用

```jsx
import styles from "./index.module.scss";

export default defineComponent({
  setup() {
    return () => <div className={styles.stencil_content}></div>;
  },
});
```

## js

- 循环请 使用 vue 模版语法，或者 map,foreach,fliter 等 方法.尽量不要出现 'for' 循环

  生成新数组 map

  循环 foreach

  筛选 fliter

  查找 find

## 使用到的插件/库 | Plugin or lib

- **eslint-plugin-vue** [eslint-plugin-vue](https://eslint.vuejs.org/user-guide/#faq)
- **axios** 强大的前端请求库
- **antv.x6** [阿里流程图框架](https://x6.antv.vision/zh/docs/api/graph/mousewheel)
- **fues.js** [fues.js Fuzzy Search 前端模糊搜索](https://github.com/krisk/Fuse)
- **echart** [echart 数据可视化](http://echarts.apache.org/zh/index.html)
- **antv** [antv 蚂蚁数据可视化](https://antv.vision/zh)
- **xlsx** [xlsx SheetJS ](https://www.npmjs.com/package/xlsx)
- **jszip** [jszip 优秀的前端压缩库 ](https://github.com/Stuk/jszip)
- **mockjs** [mockjs 模拟和交互数据](http://mockjs.com/)
- **wangeditor** [wangeditor 富文本编辑器](https://www.wangeditor.com/doc/)
- **fullcalendar** [fullcalendar 丰富的日历插件](https://github.com/fullcalendar/fullcalendar-example-projects/tree/master/vue3-typescript)
