<template>
  <div class="IndexlBoodKinship">
    <div class="mapBtn" v-show="!showMap" @click="showMap = true">显示图例</div>
    <div class="map" v-show="showMap">
      <em class="el-icon-close" @click="showMap = false"></em>
      <p v-for="(item, index) in list" class="map-item" :key="index">
        <span>{{ item.name }} ：</span
        ><img
          class="icon-img"
          :style="{ width: item.width, marginRight: item.right }"
          :src="item.icon"
          alt=""
        />
      </p>
    </div>
    <el-empty v-show="show" description="暂无数据"></el-empty>
    <MyChart
      v-show="!show"
      ref="echartRef"
      :init="false"
      class="merticsChart"
      :option="option"
    ></MyChart>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  nextTick,
} from "vue";
import MyChart from "@/components/Echart/index.vue";
import Api, { Blood } from "../api/index";
import RenderTypeCard from "./RenderTypeCard";
//=============图片====================
import dbSvg from "@/assets/images/db.svg";
import apiSvg from "@/assets/images/api.svg";
import cardSvg from "@/assets/images/tj.svg";
import baobiaoSvg from "@/assets/images/baobiao.svg";
import { truncate } from "lodash";
const assetSvg = "/admin/flowChart/icon/asset.svg";
const atomSvg = "/admin/flowChart/icon/atom.svg";
const constant = "/admin/flowChart/icon/constant.svg";
const business = "/admin/flowChart/icon/business.svg";
//0.数仓、1.数据源、3.原子指标、4.衍生指标、5.业务指标、6.复合指标、7.自定义指标、8.数据卡片、9.API、10.报表
export default defineComponent({
  components: {
    MyChart,
  },
  setup() {
    // 关系图
    let preZoom = 5;
    const list = ref([
      { name: "数仓", icon: dbSvg, width: "20px", right: "" },
      { name: "数据源", icon: assetSvg, width: "32px", right: "-5px" },
      { name: "原子指标", icon: atomSvg, width: "32px", right: "-5px" },
      { name: "衍生指标", icon: constant, width: "32px", right: "-5px" },
      { name: "业务指标", icon: business, width: "32px", right: "-5px" },
      { name: "复合指标", icon: business, width: "32px", right: "-5px" },
      { name: "自定义指标", icon: business, width: "32px", right: "-5px" },
      { name: "数据卡片", icon: cardSvg, width: "20px", right: "" },
      { name: "API", icon: apiSvg, width: "20px", right: "" },
      { name: "报表", icon: baobiaoSvg, width: "20px", right: "" },
    ]);

    const renderCard = new RenderTypeCard();
    const echartRef = ref<InstanceType<typeof MyChart>>(null);
    const show = ref(false);
    const showMap = ref(false);
    const echartInit = (nodeData: Blood) => {
      // nodeData.nodes = [];
      // nodeData.relations = [];
      // for (let i = 0; i <= 10; i++) {
      //   nodeData.nodes.push({
      //     nodeId: "c9c48527-8604-460a-bd0a-9bd8c3894bde" + i,
      //     noteType: i,
      //     nodeName: "测试测试测试" + i,
      //   });
      //   if (i < 10) {
      //     nodeData.relations.push({
      //       toId: "c9c48527-8604-460a-bd0a-9bd8c3894bde" + (i + 1),
      //       toType: 3,
      //       fromType: 1,
      //       fromId: "c9c48527-8604-460a-bd0a-9bd8c3894bde" + i,
      //     });
      //   }
      // }

      echartRef.value?.dispose();
      option.value.series[0].data = [];
      option.value.series[0].links = [];
      const data = option.value.series[0].data;
      const links = option.value.series[0].links;
      nodeData.nodes.forEach((node, index) => {
        data.push(renderCard.selectRander(node));
      });
      nodeData.relations.forEach((link) => {
        links.push(renderCard.getLinks(link));
      });
      // console.log(echartRef.value);
      echartRef.value.echartInit();
      // onMousewheel(echartRef.value.myChart);
    };

    const fontSizeProportion = 12 / 5;
    const widthProportion = 80 / 5;
    //注册之前先取消事件

    const onMousewheel = (myForce: any) => {
      myForce.getZr().off("mousewheel");
      myForce.getZr().on("mousewheel", function () {
        var option = myForce.getOption();
        if (!option) return;
        var zoom = option.series[0].zoom;
        const fontSize = zoom * fontSizeProportion;
        option.series[0].label.fontSize = fontSize.toFixed(2);
        option.series[0].data.forEach((element: any) => {
          element.label.width = (zoom * widthProportion).toFixed(2);
        });
        myForce.setOption(option);
        // }
      });
    };

    const option = ref({
      tooltip: {},
      series: [
        {
          type: "graph",
          layout: "force",
          zoom: 1 * preZoom,
          // animation: false,
          // animationDurationUpdate: 1500,
          // animationEasingUpdate: "quinticInOut",
          roam: true,
          scaleLimit: {
            min: preZoom,
            max: preZoom,
          },
          zoomLock: true,
          label: {
            padding: 2,
            show: true,
            color: "#fff",
            width: 90,
            // overflow: "break",
            overflow: "truncate",
            verticalAlign: "middle",
            fontSize: 12,
          },
          edgeSymbol: ["circle", "arrow"],
          edgeSymbolSize: [4, 10],
          data: [],
          links: [],
          force: {
            layoutAnimation: false,
            edgeLength: 20,
            repulsion: 100,
            gravity: 0.2,
          },
          lineStyle: {
            opacity: 1,
            width: 2,
            // curveness: 0.1,
            color: "#D7DBE3",
          },
        },
      ],
    });

    // 请求
    const requset = async (rowId: string) => {
      const res = await Api.getBlood(rowId);
      if (res.code == 200) {
        if (res.result.nodes.length <= 0) {
          show.value = true;
        } else {
          show.value = false;
        }
        nextTick(() => {
          echartInit(res.result);
        });
      } else {
        show.value = true;
        Api.ElMessage.error(res.message);
      }
    };

    return { requset, echartRef, option, show, list, showMap };
  },
});
</script>
<style scoped lang="scss">
.IndexlBoodKinship {
  position: relative;
  .el-icon-close {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 18px;
    cursor: pointer;
  }

  .mapBtn {
    position: absolute;
    font-size: 12px;
    color: #666;
    z-index: 10;
    right: 0;
    top: 0;
    cursor: pointer;
  }
  .map {
    border: 1px solid #eee;
    font-size: 12px;
    padding: 10px;
    width: 100%;
    background-color: #fff;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    padding-right: 20px;
    border-radius: 4px;
  }
  .map-item {
    padding: 0 6px;
    display: flex;

    justify-content: space-between;
    align-items: center;
    height: 24px;
    overflow: hidden;
    span {
      display: inline-flex;
      text-align: right;
      align-items: center;
    }
  }
  .icon-img {
    width: 20px;
    // height: 20px;
  }
}
.merticsChart {
  height: 500px;
}
</style>
