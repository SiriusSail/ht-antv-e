<template>
  <div class="chart_gourp">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div class="chart_box_head">
            <div class="box_head_title">
              <span @click="href('/demandManage/kanban')">我的任务</span>
            </div>
            <div class="operate" @click="href('/demandManage/kanban?add=1')">
              新建任务
            </div>
          </div>
          <div class="chart_box_body">
            <div class="body_left">
              <div class="bodyInfo">
                <div class="num_label">
                  任务总数
                  <span class="index_num">{{
                    myTaskOptions.count.taskTotal
                  }}</span>
                </div>
              </div>
              <MyChart
                v-if="Object.keys(myTaskOptions.dows).length > 0"
                :option="myTaskOptions.dows"
              />
            </div>
            <div class="body_right">
              <div class="progress">
                <p class="pending">
                  待进行
                  <span>{{ myTaskOptions.count.pending }}</span>
                </p>
                <p class="handing">
                  进行中
                  <span>{{ myTaskOptions.count.haveInHand }}</span>
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="chart_box_head">
            <div class="box_head_title">
              <span @click="href('/myhelp')">我的求助</span>
            </div>
            <div class="operate" @click="href('/mySeekHelp')">发起求助</div>
          </div>

          <div class="chart_box_body">
            <div class="body_left">
              <div class="bodyInfo">
                <div class="num_label">
                  已邀请
                  <span class="index_num">{{ helpData.helpTotal }}</span>
                </div>
              </div>
              <MyChart
                v-if="helpData.chartData.xData.length > 0"
                :option="options"
              />
            </div>
            <div class="body_right">
              <div class="progress">
                <p class="handing">
                  待完成
                  <span>{{ helpData.unFinishedTotal || 0 }}</span>
                </p>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div class="chart_box_head">
            <div class="box_head_title">
              <span @click="href('/empowerment')">我的赋能</span>
            </div>
            <div class="operate disable" style="color: #cccccc">点亮赋能</div>
          </div>

          <div class="chart_box_body">
            <div class="body_left">
              <div class="bodyInfo">
                <div class="num_label">
                  当前排名
                  <span class="index_num">{{ state.currentRanking.rank }}</span>
                  <em
                    class="icon-rise iconfont"
                    v-if="state.currentRanking.rankChange == 0"
                  />
                  <em
                    class="icon-decline iconfont"
                    v-if="state.currentRanking.rankChange == 1"
                  />
                  <em
                    class="el-icon-minus iconfont"
                    v-if="state.currentRanking.rankChange == 2"
                  />
                </div>
                <div class="num_label">
                  奉献值：
                  <span class="index_num">
                    {{ state.currentRanking.summaryPoints }}</span
                  >
                </div>
                <div class="empowerment">
                  <p>开发赋能：{{ state.currentRanking.devPoints }}</p>
                  <p>知识赋能：{{ state.currentRanking.knowledgePoints }}</p>
                  <p>
                    推荐赋能：{{ state.currentRanking.recommendationPoints }}
                  </p>
                </div>
              </div>

              <MyChart
                v-if="Object.keys(energize).length > 0"
                :option="energize"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card chart4">
          <div class="chart_box_head">
            <div class="box_head_title"><span> 我的画像</span></div>
          </div>
          <div class="chart_box_body">
            <div class="body_left">
              <MyChart :option="options4" />
            </div>
            <div class="body_left">
              <MyChart
                v-if="Object.keys(profileOptions).length > 0"
                :option="profileOptions"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  computed,
  onMounted,
  onDeactivated,
} from "vue";
import { useRouter } from "vue-router";
import MyChart from "@/components/Echart/index.vue";

import {
  ApiPortraitProfile,
  MyPoints,
  ApiForMyHelp,
  ApiMyTask,
} from "../api/index";
import { getNowTime } from "@/utils/func";

const router = useRouter();

const state = reactive({
  currentRanking: {},
});

// 折线图
const options = ref({
  grid: {
    left: 0,
    right: 0,
    top: "15%",
    bottom: 0,
    containLabel: true,
  },
  tooltip: {},
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: { type: "value" },
  series: [
    {
      itemStyle: {
        color: "rgba(91,143,249)",
        borderColor: "#fff",
        borderWidth: 1,
        //   borderWidth: 4
      },
      symbol: "circle", // 实心
      symbolSize: 6,
      lineStyle: {
        color: "rgba(91,143,249)",
      },
      data: [0, 0, 0, 0, 0, 0, 0],
      // data: [150, 230, 224, 218, 135, 147, 260],
      type: "line",
    },
  ],
});

let pData = [
  {
    itemstyle: { color: "#c71969" },
    name: "奉献值",
    y: 0.4,
    x: 1.2,
    id: "1",
    symbolSize: 50,
  },
  {
    itemstyle: { color: "#1984c7" },
    name: "开发赋能",
    y: 0.4,
    x: 1.6,
    id: "2",
    symbolSize: 50,
  },
  {
    itemstyle: { color: "#8419c7" },
    name: "知识赋能",
    y: 0.4,
    x: 2,
    id: "3",
    symbolSize: 50,
  },
  {
    itemstyle: { color: "#c76919" },
    name: "推荐赋能",
    y: 0.4,
    x: 2.4,
    id: "4",
    symbolSize: 50,
  },
];
const energize = ref({});
// 依赖图
const options3 = ref({
  title: {
    show: false,
  },
  series: [
    {
      type: "graph",
      top: "20px",
      left: "65%",
      data: pData.map((node) => ({
        x: node.x,
        y: node.y,
        id: node.id,
        name: node.name,
        symbolSize: node.symbolSize,
        itemStyle: node.itemstyle,
      })),
      lineStyle: {
        width: 0.5,
        curveness: 0.3,
        opacity: 0.7,
      },
    },
  ],
});
// 雷达图
const options4 = ref({
  title: {
    text: "Basic Radar Chart",
    show: false,
  },

  legend: {
    show: false,
    data: ["Allocated Budget", "Actual Spending"],
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: "A", max: 100 },
      { name: "B", max: 100 },
      { name: "C", max: 100 },
      { name: "D", max: 100 },
      { name: "E", max: 100 },
      { name: "F", max: 100 },
      // { name: "A", max: 100 },
      // { name: "B", max: 100 },
      // { name: "C", max: 100 },
      // { name: "D", max: 100 },
      // { name: "E", max: 100 },
      // { name: "F", max: 100 },
    ],
    axisName: {
      fontSize: 10,
    },
    center: ["50%", "50%"],
  },
  series: [
    {
      colors: ["#61DDAA", "#5B8FF9"],
      type: "radar",
      symbol: "circle", // 拐点的样式圆，还可以取值'rect'-方
      symbolSize: 4, // 拐点的大小
      areaStyle: {
        normal: {
          opacity: 0.5,
        },
      },

      data: [
        {
          symbolSize: 6,
          label: {
            show: true,
          },
          value: [0, 0, 0, 0, 0, 0],
          // value: [67, 87, 56, 93, 73, 79],
        },
        {
          symbolSize: 6,
          label: {
            show: true,
          },
          value: [0, 0, 0, 0, 0, 0],
          // value: [77, 57, 86, 63, 53, 89],
        },
      ],
    },
  ],
});

// 词云
const options5 = ref({
  title: {
    show: false,
  },
  backgroundColor: "#fff",
  series: [
    {
      type: "wordCloud",
      // 用来调整词之间的距离
      gridSize: 1,
      // 用来调整字的大小范围
      sizeRange: [6, 24],
      rotationRange: [0, 0],
      left: "center",
      top: "center",
      right: null,
      bottom: null,
      width: "100%",
      height: "100%",
      textStyle: {
        color() {
          const str = `rgb(${Math.round(Math.random() * 255)}, ${Math.round(
            Math.random() * 255
          )}, ${Math.round(Math.random() * 255)})`;
          return str;
        },
      },

      data: [],
    },
  ],
});

const profileOptions = ref({});
const myTaskOptions = reactive({
  dows: {},
  count: { haveInHand: 0, pending: 0, taskTotal: 0 },
});

const helpData = reactive({
  unFinishedTotal: 0,
  helpTotal: 0,
  chartData: { yData: [], xData: [] },
});
// 我的求助
const getForMyHelp = () => {
  ApiForMyHelp().then((res) => {
    helpData.unFinishedTotal = res.result.unFinishedTotal;
    helpData.helpTotal = res.result.helpTotal;
    helpData.chartData = res.result.chartData;
    options.value.series[0].data = helpData.chartData.yData;
    options.value.xAxis.data = helpData.chartData.xData;
  });
};

// 我的任务
const getMyTask = () => {
  ApiMyTask().then((res: any) => {
    const result = res?.result;
    const arrX: string[] = [];
    const arrY: number[] = [];
    Object.keys(result).forEach((item: string) => {
      if (item === "haveInHand" || item === "pending" || item === "taskTotal") {
        myTaskOptions.count[item] = result[item];
      } else {
        arrY.push(result[item]);
        arrX.push(`${item}月`);
      }
    });
    options.value.series[0].data = arrY;
    options.value.xAxis.data = arrX;
    myTaskOptions.dows = options.value;
  });
};

// 我的画像
const getPortraitProfile = () => {
  ApiPortraitProfile().then((res: any) => {
    const lable = res?.result?.userLabels;
    if (!lable) {
      profileOptions.value = options5.value;
      return;
    }
    options5.value.series[0].data = lable
      .split(",")
      .map((item: string, index: number) => ({
        name: item,
        value: index * 3,
      }));
    profileOptions.value = options5.value;
  });
};

function maxNum(max: number, cur: number) {
  return cur / (max / 50);
}
function maxArrValue(data: any) {
  var list = new Array();
  for (var i in data) {
    if (
      i === "summaryPoints" ||
      i === "devPoints" ||
      i === "knowledgePoints" ||
      i === "recommendationPoints"
    ) {
      list.push(parseInt(data[i]));
    }
  }
  list.sort(function (num1, num2) {
    return num1 - num2;
  });
  return list[list.length - 1];
}
const getMyPoints = () => {
  MyPoints().then((res: any) => {
    let newData: any = [];
    pData.map((item) => {
      if (item.name === "奉献值") {
        item.name = item.name;
        item.symbolSize = maxNum(
          maxArrValue(res.result),
          res.result.summaryPoints
        );
        newData.push(item);
      }
      if (item.name === "开发赋能") {
        item.name = item.name;
        item.symbolSize = maxNum(maxArrValue(res.result), res.result.devPoints);
        newData.push(item);
      }
      if (item.name === "知识赋能") {
        item.name = item.name;
        item.symbolSize = maxNum(
          maxArrValue(res.result),
          res.result.knowledgePoints
        );
        newData.push(item);
      }
      if (item.name === "推荐赋能") {
        item.name = item.name;
        item.symbolSize = maxNum(
          maxArrValue(res.result),
          res.result.recommendationPoints
        );
        newData.push(item);
      }
    });
    options3.value.series[0].data = newData.map((node: any) => ({
      x: node.x,
      y: node.y,
      id: node.id,
      name: node.name,
      symbolSize: node.symbolSize,
      itemStyle: node.itemstyle,
    }));
    energize.value = options3.value;
    state.currentRanking = res.result;
  });
};

// DOM加载完毕
onMounted(() => {
  getMyPoints();
  getPortraitProfile();
  getMyTask();
  getForMyHelp();
});

const href = (url: string) => {
  router.push(url);
};
</script>

<style scoped lang="scss">
//图表
.chart_gourp {
  :deep(.el-card__body) {
    height: 250px;
  }
  .chart_box_head {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .box_head_title {
      font-weight: 500;
      font-size: 20px;

      line-height: 30px;
      flex: 1;
      span {
        cursor: pointer;
      }
    }
    .operate {
      font-size: 14px;
      color: #20a0ff;
      cursor: pointer;
    }
  }
  .num_label {
    font-size: 14px;
    color: #333333;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 22px;
    .index_num {
      display: inline-block;
      height: 22px;
      line-height: 22px;
    }
  }
  .empowerment {
    font-size: 12px;
    color: #cccccc;
  }
  .bodyInfo {
    position: absolute;
    left: 0;
    top: 18px;
    z-index: 1;
  }
  .chart_box_body {
    position: relative;
    display: flex;
    padding-top: 40px;
    :deep(.chart_dom) {
      width: 100%;
      height: 140px;
    }
  }
  .body_right {
    padding-left: 4px;
    font-size: 14px;
    min-width: 60px;
    color: #cccccc;
    width: 50px;

    .progress {
      font-size: 12px;
      .pending {
        span {
          color: #b22711;
        }
      }
      .handing {
        span {
          color: #1b3c90;
        }
      }
    }
  }
  .body_left {
    flex: 1;
  }
  .icon-rise {
    font-size: 18px;
    color: #1ec435;
  }
  .icon-decline {
    font-size: 18px;
    color: #f53535;
  }
  .el-icon-minus {
    font-size: 18px;
    color: #f1a644;
  }
}
</style>
