<template>
  <div class="digitalMarketing">
    <CqHead></CqHead>
    <!-- body -->
    <div class="contribution">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card body-style="padding:0;">
            <el-carousel :interval="5000" height="600px" arrow="always">
              <el-carousel-item v-for="(item, index) in 2" :key="item">
                <ContributionDegree v-if="index === 0" />

                <CqSales v-if="index === 1" />
              </el-carousel-item>
            </el-carousel>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card body-style="padding:0;height:600px;">
            <em class="el-icon-setting icon_set" @click="handleSet()"></em>
            <el-carousel
              class="swper"
              ref="refCarousel"
              :autoplay="false"
              @change="handleChange"
              height="380px"
              arrow="always"
              indicator-position="none"
            >
              <el-carousel-item
                class="swper_item"
                v-for="(item, index) in cardList"
                :key="index"
              >
                <div
                  class="chart_card"
                  :id="'refChart' + index"
                  :style="{ width: cardWidth }"
                ></div>
              </el-carousel-item>
            </el-carousel>
            <CqRectangle />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 指标统计 -->
    <el-card body-style="padding:0;">
      <el-row :gutter="20">
        <el-col :span="18">
          <CqTarget />
        </el-col>
        <el-col :span="6">
          <CqStatistics />
        </el-col>
      </el-row>
    </el-card>
    <!-- fotter -->
    <CqFotter />
    <!-- 新增 -->
    <el-dialog top="20px" v-model="state.showModel" width="80%">
      <Search
        class="searchInput"
        v-model="state.key"
        @search="handleSearch()"
      ></Search>
      <div class="card_img_list">
        <img
          :src="item.thumbnail"
          v-for="item in cardImgList"
          :key="item.rowId"
          @click="handleItem(item)"
          :class="['img', item.choose === 1 ? 'selected' : '']"
          alt=""
        />
      </div>
      <template #footer>
        <el-button type="primary" @click="handleConfirm()">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  ref,
  reactive,
  nextTick,
  computed,
  onMounted,
  onDeactivated,
  onBeforeUpdate,
} from "vue";
import MyChart from "@/components/Echart/index.vue";
import Search from "@/components/Search/Search-input.vue";
import CqHead from "./busComponent/head.vue";
import ContributionDegree from "./busComponent/contributionDegree.vue";
import CqFotter from "./busComponent/fotter.vue";
import CqRectangle from "./busComponent/rectangle.vue";
import CqStatistics from "./busComponent/statistics.vue";
import CqTarget from "./busComponent/target.vue";
// import CqChartGourp from "./busComponent/chartGourp.vue";
// import CqContributionTop5 from "./busComponent/contributionTop5.vue";
import CqSales from "./busComponent/sales.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus/lib/components/message";
import {
  getIicindcardList,
  getCarouselList,
  getImgSelected,
} from "./api/index";
import dayjs from "dayjs";
import Graph from "@/components/Graph/graph";
const router = useRouter();
const refCarousel = ref(null);
const cardWidth = ref(0);
const state = reactive({
  showModel: false,
  key: "",
  rowIds: [],
  interval: 5000,
});
const refChart = ref([]);
let cardList = ref([]);
let cardImgList = ref([]);
let graph: Graph = {} as any;
const curComp = ref("text-shape");
const intGraph = (idx) => {
  // 创建x6实例
  graph = new Graph({
    containerId: "refChart" + idx,
    stencilId: "stencilContent",
    minimapId: "minimapContainer",
    grid: false,
    nodeMovable: false,
    selecting: false,
  });
};
onBeforeUpdate(() => {
  refChart.value = [];
});
onMounted(() => {
  cardWidth.value = refCarousel.value.$el.clientWidth - 110 + "px";

  getIicindcard();
  getCarousel();
});

//选中图片
const handleItem = (data) => {
  data.choose = data.choose == 1 ? 0 : 1;
  if (state.rowIds.includes(data.rowId)) {
    state.rowIds.splice(
      state.rowIds.findIndex((item) => item === data.rowId),
      1
    );
  } else {
    state.rowIds.push(data.rowId);
  }
};

// 确认选中的图片
const handleConfirm = async () => {
  const res = await getImgSelected({ rowIds: state.rowIds });
  if (res.success) {
    getCarousel();
    state.showModel = false;
  } else {
    ElMessage({
      message: "失败了",
      type: "error",
      customClass: "msgZindex",
    });
  }
};

const getIicindcard = async () => {
  cardImgList.value = [];
  const res = await getIicindcardList({ page: 1, limit: 500, name: state.key });
  if (res.result.records && res.result.records.length > 0) {
    res.result.records.map((item) => {
      cardImgList.value = [...cardImgList.value, item];
      if (item.choose == 1) {
        state.rowIds.push(item.rowId);
      }
    });
  }
};

const getCarousel = async () => {
  cardList.value = [];
  const res = await getCarouselList();
  if (res.result && res.result.length > 0) {
    res.result.map((item) => {
      const list = JSON.parse(item.cardContent);
      cardList.value.push(list);
    });
  } else {
    cardList.value = [
      [
        {
          attrs: {
            body: { show: true },
            image: { width: 400, height: 300 },
            option: {
              curType: "line-simple",
              title: {
                text: "基础折线图",
              },
              legend: {
                data: ["Email"],
              },
              xAxis: {
                type: "category",
                data: [],
              },
              yAxis: {
                type: "value",
              },
              series: [
                {
                  name: "Email",
                  data: [0, 0, 0, 0, 0, 0, 0],
                  type: "line",
                },
              ],
            },
            id: "0089349c-9cd0-4459-8800-8cf692ac54af",
          },
          id: "0089349c-9cd0-4459-8800-8cf692ac54af",
          position: { x: 5, y: 80 },
          shape: "echart-shape",
          size: { width: 400, height: 300 },
          view: "vue-shape-view",
          zIndex: 1,
        },
      ],
    ];
  }
  nextTick(() => {
    refCarousel.value.setActiveItem(0);
    showCanvas(0);
  });
};
function showCanvas(index) {
  setTimeout(() => {
    intGraph(index);
    graph.graph.fromJSON(cardList.value[index]);
  }, 10);
}
// 走马灯切换
const handleChange = (e) => {
  showCanvas(e);
};

// 设置走马灯
const handleSet = () => {
  state.showModel = true;
};
//搜索
const handleSearch = () => {
  getIicindcard();
};
</script>

<style scoped lang="scss">
.digitalMarketing {
  background-color: #f5f7fa;
  .contribution {
    padding: 0 20px;
    margin-bottom: 20px;
  }
  .swper {
    height: 380px;
    .swper_item {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .chart_card {
      height: 380px;
    }
  }
  :deep(.el-dialog) {
    .el-dialog__body {
      padding: 10px;
    }
    .el-dialog__header {
      padding: 0px;
    }
  }
  .icon_set {
    cursor: pointer;
    padding-top: 5px;
    padding-left: 5px;
  }
  .card_img_list {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .img {
      margin-right: 10px;
      width: 100px;
      height: 70px;
      border: 1px solid #cccccc;
      margin-top: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      border-radius: 2px;
    }
    .selected {
      border: 1px solid #4872b1;
    }
  }
}
</style>
