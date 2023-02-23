/* eslint-disable vue/attribute-hyphenation */
<template>
  <div class="flow_chart_wrap">
    <!-- 左侧 -->
    <div class="left">
      <div class="stencil_overflow" :class="{ stencil_hide: !isShowLeft }">
        <div id="stencilContent" class="stencil_content"></div>
      </div>
      <div
        class="collapse_item_title collapse_left"
        @click="handleDrawer('left')"
      >
        {{ isShowLeft ? "<" : ">" }}
      </div>
    </div>

    <!-- 中间 -->
    <div class="center">
      <div class="graph_content">
        <div class="graph_title">
          <div class="graph_title_txt" @click="isShowTitle = true">
            {{ defaultData.title }}
          </div>
          <div class="graph_title_icon flex-row">
            <ElTooltip effect="dark" content="锁定" placement="bottom">
              <em class="icon-lock iconfont" />
            </ElTooltip>
            <ElTooltip effect="dark" content="新建" placement="bottom">
              <em class="icon-plus iconfont" @click="handleCreateNew" />
            </ElTooltip>
            <ElTooltip effect="dark" content="保存到草稿箱" placement="bottom">
              <em class="icon-save iconfont" @click="handleDrafts" />
            </ElTooltip>
            <ElTooltip effect="dark" content="发布" placement="bottom">
              <em class="icon-issue iconfont" @click="definePublish" />
            </ElTooltip>
            <ElTooltip effect="dark" content="下载到本地" placement="bottom">
              <em class="icon-download iconfont" @click="downLoad" />
            </ElTooltip>
            <ElTooltip
              effect="dark"
              content="上传到画布"
              placement="bottom"
              style="position: relative; margin-top: 4px"
            >
              <div slot="content">
                <em class="icon-upload iconfont" />
                <input
                  ref="inputRef"
                  type="file"
                  style="position: absolute; width: 34px"
                  class="up_load"
                  @change="uploadChange"
                />
              </div>
            </ElTooltip>
            <ElTooltip effect="dark" content="预览" placement="bottom">
              <em class="icon-preview iconfont" @click="goToPreview" />
            </ElTooltip>
          </div>
        </div>
        <!-- 画布 -->
        <div id="graph-content" class="graph"></div>

        <!-- 放大缩小 -->
        <div class="graph_slider">
          <Slider :value="sliderValue" :change-event="zoomEvent" />
        </div>
      </div>
    </div>

    <!-- 右侧 -->
    <div class="right" :class="{ right_hide: !isShowRight }">
      <div
        class="collapse_item_title collapse_right"
        @click="handleDrawer('right')"
      >
        {{ !isShowRight ? "" : ">" }}
      </div>
      <div class="right_overflow">
        <div class="right_content">
          <div class="info_table">
            <ItemContent
              v-show="curComp == 'text-shape'"
              :select-node="selectNode"
            />
            <ItemEcharts
              v-show="curComp == 'echart-shape'"
              :select-node="selectNode"
            />
          </div>
          <div id="minimapContainer" class="info_thumbnail"></div>
        </div>
      </div>
    </div>

    <!-- 修改名称弹窗 -->
    <ModifyTitle
      :visible="isShowTitle"
      :data="defaultData"
      @on-change="changeInfomation"
      @on-close="
        () => {
          isShowTitle = false;
        }
      "
    />

    <!-- 草稿箱弹出层 -->
    <drafts
      :is-show="flowchartStore.isShowDrafts"
      :on-select="showMode"
      :get-list="(page) => getDraftsList(page)"
      :delege-ddmflow="(id) => delDrafts([id])"
      :on-close="
        () => {
          flowchartStore.isShowDrafts = false;
        }
      "
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, provide, watch, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as Element from "element-plus";
import { Node, Cell } from "@antv/x6";
import { chartConfig } from "./config";
import Graph from "@/components/Graph/graph";
// import Sidebar from "./components/sidebar.vue";
// import DraftsPage from "./components/indexCard/draftsPage.vue";
// import DispatchComp from "./components/indexCard/dispatchComp.vue";
// import Tabel from "@/components/TableFormItem";
import Drafts from "./components/drafts";
import ItemContent from "./components/indexCard/itemContent.vue";
import ItemEcharts from "./components/indexCard/itemEcharts.vue";
import ModifyTitle from "./components/indexCard/modifyTitle.vue";
import Slider from "./components/slider";
import http, { DraftsItem } from "./components/indexCard/api";
import { FormOption } from "@/components/TableFormItem/index.d";
import downfile from "./components/downfile";
import flowchartSidebarStore from "@/layout/components/FlowchartSidebar/store";
import fromDraftsPage from "./components/indexCard/store";

const { ElMessage, ElTooltip } = Element;

export default defineComponent({
  components: {
    // Sidebar,
    ElTooltip,
    Slider,
    // Tabel,
    // DraftsPage,
    // DispatchComp,
    Drafts,
    ItemContent,
    ItemEcharts,
    ModifyTitle,
  },
  setup() {
    let graph: Graph = {} as any;
    const flowchartStore = flowchartSidebarStore();
    const selectNode = ref<Cell | Node | null>();
    const formOptions = ref<FormOption[]>([]);
    const flowIds = ref([]);
    const sliderValue = ref(1); // 放大倍率
    const isShowLeft = ref(true); // 展示列表
    const isShowRight = ref(false); // 展示列表
    const isShowTitle = ref(false); // 展示标题弹窗
    const defaultData = reactive({ title: "未命名", des: "" }); // 默认标题和描述
    const cacheId = reactive({ draftId: "", publishId: "" }); // 保存草稿箱和发布id
    const store = fromDraftsPage(); // 是否来自草稿箱
    let positionList: { x: number; y: number }[] = []; // 保存坐标
    let canvas: HTMLCanvasElement;

    // 回显数据保存
    let orignData = reactive<DraftsItem>({
      cardContent: "",
      gmtCreate: "",
      gmtModified: "",
      id: 1,
      isDeleted: 1,
      name: "",
      rowId: "",
      status: 1,
      createBy: "",
      modifiedBy: "",
      draftId: "",
      publishId: "",
      description: "",
    });
    const curComp = ref("text-shape");
    const inputRef: HTMLInputElement = ref(null);
    const router = useRouter();

    // 添加指标卡片
    const selectDataDeve = () => {
      graph.upDateStencil({
        title: "数据开发",
        layoutOptions: {
          columns: 3,
          columnWidth: 65,
        },
        nodeOppoOption: chartConfig,
      });
    };

    // 显示修改标题弹窗
    const changeInfomation = (s: { info: { title: string; des: string } }) => {
      defaultData.title = s.info.title ? s.info.title : "未命名";
      defaultData.des = s.info.des;
    };

    const resetInfo = () => {
      defaultData.title = "未命名";
      defaultData.des = "";
    };

    const intGraph = () => {
      // 创建x6实例
      graph = new Graph({
        containerId: "graph-content",
        stencilId: "stencilContent",
        minimapId: "minimapContainer",
        graphOptions: {
          resizing: {
            enabled: () => true,
          },
        },
      });

      graph.graph.on("selection:changed", (args) => {
        args.added.forEach((cell) => {
          selectNode.value = cell;
          curComp.value = selectNode.value.shape;
        });
        isShowRight.value = true;
      });
      // 添加 选择 NODE 节点事件
      graph.graph.on("node:click", ({ e, x, y, node, view }) => {
        switch (node.shape) {
          case "echart-shape":
            // echatOption.value = node.attrs?.option;
            break;
          default:
            formOptions.value = [];
        }
      });
      // 缩放回调
      graph.graph.on("scale", ({ sx, sy }) => {
        sliderValue.value = sx;
      });
      // 取消选择事件
      graph.graph.on("blank:click", () => {
        // formOptions.value = [];
        // selectNode.value = null;
        // isShowRight.value = false;
      });

      // 删除
      graph.graph.on("node:removed", () => {
        formOptions.value = [];
        selectNode.value = null;
        // isShowRight.value = false;
        if (graph.isEmpty()) {
          defaultData.title = "未命名";
        }
      });
      // 添加节点事件
      graph.graph.on("node:added", ({ cell }) => {
        // const flag = true
        // if (flag) {
        //   ElMessage.error('已锁定')
        //   cell.remove();
        // }
      });
    };

    const getInfomation = (id: string) => {
      console.log(id);
    };

    let graphForm: Node.Metadata = [];
    let graphString = "";

    // 过滤数据字段
    const filterData = (cache = false) => {
      flowIds.value = [];
      positionList = [];
      const orign = graph.graph.toJSON();
      graphForm = orign.cells.map((item) => {
        // eslint-disable-next-line no-param-reassign
        delete item.component;
        if (item.attrs.option.quota) {
          flowIds.value.push(item.attrs.option.quota);
        }
        positionList.push(item.position);
        return item;
      });
      //寻找最小Item
      let miny: number;
      let minx: number;

      graphForm.forEach((element: any, index: number) => {
        if (!minx) {
          minx = element.position.x;
          miny = element.position.y;
        } else if (minx > element.position.x) {
          minx = element.position.x;
          miny = element.position.y;
        }
      });

      // 所有等比例换位
      graphForm.forEach((element: any) => {
        // console.log(minx, miny);
        if (minx >= 0) {
          element.position.x -= Math.abs(minx);
        } else {
          element.position.x += Math.abs(minx);
        }
        if (miny >= 0) {
          element.position.y -= Math.abs(miny);
        } else {
          element.position.y += Math.abs(miny);
        }
        element.position.x += 20;
        element.position.y += 20;
        // console.log(element.position.x);
        // console.log(element.position.y);
      });
      console.log(graphForm);
      graphString = JSON.stringify(graphForm);
      // 存Node，预览用
      if (cache) {
        localStorage.setItem("PREVIEW_NODE", graphString);
      }
    };

    // 验证名称要填写
    const handleVerify = (): boolean => {
      if (graph.isEmpty()) {
        ElMessage.warning("无内容");
        return false;
      }
      if (defaultData.title === "未命名") {
        ElMessage.warning("名称“未命名”，请点击填写");
        return false;
      }
      return true;
    };

    // 发布
    const confirmPublish = async () => {
      // console.log(canvas.toDataURL("image/png"));
      try {
        const res = await http.ApiCardPublish({
          thumbnail: canvas.toDataURL("image/png"),
          content: graphString,
          flowIds: flowIds.value,
          name: defaultData.title,
          description: defaultData.des,
          draftId: cacheId.draftId,
          publishId: cacheId.publishId,
        });
        ElMessage.success("发布成功");
        const { draftId, publishId } = res.result;
        cacheId.draftId = draftId;
        cacheId.publishId = publishId;
        resetInfo();
      } catch (err) {
        ElMessage.error("失败");
      }
    };

    // 处理保存图片
    const savePic = () => {
      canvas = document.createElement("canvas");
      const container = document.querySelector("#graph-content");
      const containerCon = container.querySelector(
        ".x6-graph-scroller-content .x6-graph-background "
      );

      canvas.width = containerCon.clientWidth;
      canvas.height = containerCon.clientHeight;
      const context = canvas.getContext("2d");
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#fff";
      context.fill();

      const canvasList = container.querySelectorAll("canvas");
      const zoom = 0.8;
      for (let i = 0; i < canvasList.length; i++) {
        const cur = new Image();
        cur.src = canvasList[i].toDataURL("image/png");
        // eslint-disable-next-line no-loop-func

        cur.onload = () => {
          const height = canvasList[i].height * zoom;
          const width = canvasList[i].width * zoom;
          context.drawImage(
            cur,
            positionList[i].x,
            positionList[i].y,
            width,
            height
          );
        };
      }
      setTimeout(() => {
        confirmPublish();
      }, 400);
    };

    // 新建
    const handleCreateNew = () => {
      const allNode = graph.graph.toJSON();
      allNode.cells.forEach((item) => {
        graph.graph.removeCell(item as any);
      });
      cacheId.draftId = "";
      cacheId.publishId = "";
    };

    const definePublish = () => {
      if (!handleVerify()) return;
      filterData();
      savePic();
    };

    // 保存草稿箱
    const saveDrafts = async () => {
      filterData();
      try {
        const res = await http.ApiSaveDrafts({
          content: graphString,
          name: defaultData.title,
          description: defaultData.des,
          draftId: cacheId.draftId,
          publishId: cacheId.publishId,
        });
        const { draftId, publishId } = res.result;
        cacheId.draftId = draftId;
        cacheId.publishId = publishId;
        ElMessage.success("成功");
        resetInfo();
      } catch (err) {
        ElMessage.error("失败");
      }
    };

    // 保存草稿箱前校验
    const handleDrafts = () => {
      if (!handleVerify()) return;
      saveDrafts();
    };

    // 预览
    const goToPreview = () => {
      filterData(true);
      const { href } = router.resolve({
        path: "/flowchart/canvasPreview",
      });
      window.open(href, "_blank");
      // graph.graph.dispose();
      // intGraph();
    };

    // 回显信息,根据ID去拿对应的信息
    const showMode = (cur: DraftsItem) => {
      store.isDrafts = true;
      orignData = cur;
      cacheId.draftId = cur.draftId;
      cacheId.publishId = cur.publishId;
      defaultData.title = cur.name;
      defaultData.des = cur.description || "";
      http.ApiGetDraftsItem(cur.rowId).then((res) => {
        const { result } = res;
        graph.graph.fromJSON(result.card_content);
      });
    };

    watch([sliderValue], ([foo]) => {
      const zoom = graph.graph.zoom();
      if (zoom !== foo) {
        graph.graph.zoom(foo - zoom);
      }
    });

    const zoomEvent = (val: number) => {
      sliderValue.value = val;
    };

    // 控制草稿箱抽屉
    const handleDrawer = (flag: string) => {
      if (flag === "left") {
        isShowLeft.value = !isShowLeft.value;
      } else if (flag === "right") {
        isShowRight.value = !isShowRight.value;
      }
      setTimeout(() => {
        graph.autoReSize();
      }, 400);
    };

    // 上传
    const uploadChange = () => {
      const file = (inputRef.value as any).files[0];
      const readFile = new FileReader();
      readFile.readAsText(file, "UTF-8");
      readFile.onload = (e: ProgressEvent) => {
        const content = (e.target as any).result;
        graph.graph.fromJSON(JSON.parse(content));
      };
    };

    // 下载
    const downLoad = () => {
      if (!handleVerify()) return;
      const orign = graph.graph.toJSON();
      graphForm = orign.cells.map((item) => {
        // eslint-disable-next-line no-param-reassign
        delete item.component;
        return item;
      });
      downfile(`${defaultData.title}.txt`, JSON.stringify(graphForm));
    };

    const getDraftsList = (page: number) =>
      http.ApiGetDraftsList({
        page,
        limit: 10,
      });

    onMounted(() => {
      const route = useRoute();
      // 如果路由有参数,则是从其他页面进来的，需要拿id去查数据
      if (route.query.id) {
        getInfomation(route.query.id as string);
      }
      intGraph();
      selectDataDeve();
    });

    provide("pageStore", {
      selectNode,
      formOptions,
    });

    return {
      downLoad,
      uploadChange,
      handleDrafts,
      definePublish,
      goToPreview,
      isShowLeft,
      isShowRight,
      flowchartStore,
      handleDrawer,
      sliderValue,
      showMode,
      inputRef,
      delDrafts: http.ApiDelDrafts,
      getDraftsList,
      selectNode,
      curComp,
      defaultData,
      changeInfomation,
      isShowTitle,
      zoomEvent,
      handleCreateNew,
    };
  },
});
</script>

<style lang="scss" scoped>
.flow_chart_wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  height: 100%;
  padding-right: 10px;
  .left {
    height: 100%;
    display: flex;
    flex-direction: row;
    position: relative;
    box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.11);
  }

  .center {
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 12px 0;
    margin-left: 12px;
    overflow: hidden;
  }

  @mixin box-shadow() {
    box-shadow: 0px 0px 5px 0px rgba(232, 232, 232, 0.53);
    border-radius: 4px;
    border: 1px solid #e5e5e5;
  }

  .graph_content {
    @include box-shadow();
    flex: auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    position: relative;
  }

  .graph_footer {
    @include box-shadow();
    height: 233px;
    width: 100%;
    padding: 20px;
    overflow: hidden;
  }
  .graph_footer_content {
    position: relative;
    transition: all 0.3s;
    height: 233px;
  }

  .graph_footer_hide {
    height: 0;
  }

  .graph_footer_icon {
    top: -8px;
    position: absolute;
    left: 50%;
    height: 8px;
    line-height: 8px;
    margin-left: -10px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 0;
    background: #eaeaea;
    color: #bfc7d2;
    transform: scaleX(1.5);
    width: 20px;
    text-align: center;
  }

  .graph_title {
    height: 66px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    flex-direction: row;
    padding: 0 25px;
    justify-content: space-between;
    align-items: center;
  }

  .graph_title_icon {
    justify-content: flex-end;
    width: 220px;
    .iconfont {
      font-size: 34px;
      margin: 4px;
      cursor: pointer;
      &:hover {
        background-color: #ededed;
        border-radius: 4px;
      }
    }
  }

  .graph {
    flex: 1;
    position: relative;
  }

  .right {
    height: 100%;
    width: 330px;
    padding-left: 10px;
    position: relative;
    transition: all 0.3s;
  }
  .right_hide {
    width: 0;
    padding: 0px;
  }

  .right_overflow {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .right_content {
    height: 100%;
    width: 320px;
    display: flex;
    flex-direction: column;
    padding: 12px 0;
  }

  .collapse_item_title {
    position: absolute;
    top: 40%;
    line-height: 23px;
    text-align: center;
    width: 10px;
    transform: scaleY(1.5);
    font-size: 10px;
    background: #eaeaea;
    color: #bfc7d2;
  }

  .stencil_overflow {
    width: 220px;
    transition: all 0.3s;
    overflow: hidden;
    position: relative;
  }

  .stencil_hide {
    width: 0;
    padding: 0px;
  }

  .stencil_content {
    width: 220px;
    position: relative;
    height: 100%;
  }

  .collapse_left {
    right: -10px;
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .collapse_right {
    left: unset;
    left: 0px;
    border-right: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  .info_table {
    @include box-shadow();
    flex: 1;
    margin-bottom: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }

  .info_text {
    @include box-shadow();
    height: 72px;
    width: 100%;
    padding: 20px;
    margin-bottom: 20px;
  }

  .info_thumbnail {
    @include box-shadow();
    height: 233px;
    width: 100%;
  }

  .graph_slider {
    position: absolute;
    width: 120px;
    right: 20px;
    bottom: 30px;
  }
  .upload-ele {
    position: absolute !important;
    top: 0px !important;
  }
  .up_load {
    top: 0;
    left: 0;
    height: "100%";
    width: "100%";
    cursor: "pointer";
    opacity: 0;
    z-index: 2;
  }
  .graph_title_txt {
    cursor: pointer;
  }
}
</style>
