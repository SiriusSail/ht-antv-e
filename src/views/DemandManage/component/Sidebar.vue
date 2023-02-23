<template>
  <div class="m-sidebar">
    <div class="box">
      <div class="time-con">
        <div class="time"><Time></Time></div>
        <div>
          <img
            v-show="isShow1"
            class="icon_dt"
            @click="href('/demandManage/kanban')"
            :src="Icon2"
            alt=""
          />
          <img
            v-show="isShow2"
            class="icon_dt"
            @click="href('/demandManage/standingBook')"
            :src="Icon1"
            alt=""
          />
        </div>
      </div>
      <div class="m-search">
        <el-input v-model="key" placeholder="需求名称搜索"> </el-input>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <div class="m-nav">
        <div class="navItem" v-for="(item, index) in navs" :key="index">
          <el-button class="btn" type="primary" @click="onClick(item.id)">
            {{ item.label }}</el-button
          >
        </div>
      </div>
      <div class="m-nav2">
        <span @click="handleDwonload">下载需求模板</span>
        <span @click="href('/demandManage/scheduling')" v-show="isShow3"
          >任务排期管理</span
        >
      </div>
    </div>

    <div class="statistics box">
      <div class="statistics-head">
        <div class="statistics-num">
          <div class="statistics-num-item">
            <span class="label">超期需求</span>
            <span class="num">{{ delay }}</span>
          </div>
          <div class="statistics-num-item">
            <span class="label">5天到期需求</span>
            <span class="num">{{ dueSoon }}</span>
          </div>
        </div>
      </div>
      <div class="statistics-card">
        <Echart ref="chartRef" :init="false" :option="option"></Echart>
        <p class="tip-text">
          <!-- （按领域统计指标数据，点击每个图例， 右侧展示相应图例的指标数据） -->
        </p>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      custom-class="template-dialog"
      width="40%"
      top="30vh"
      @close="handleClose"
    >
      <template #title>导入需求 </template>
      <!-- 指标导入 -->
      <div class="upload">
        <el-upload
          ref="refUpload"
          class="upload-demo"
          drag
          :action="url"
          :on-success="onSuccess"
          :modal="false"
          :file-list="fileList"
          :on-error="onError"
          :headers="{
            'cas-token': getToken(),
          }"
        >
          <div class="upload_text">拖拉指标模板文件到这里</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Echart from "@/components/Echart/index.vue";
import dayjs from "dayjs";
import RuleAlert from "@/views/RuleCoding/index2.vue";
import Api from "../api/index";

import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  nextTick,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import Time from "@/components/Time/index.vue";
import Icondt from "@/assets/images/icon_dt.png";
import Icon1 from "@/assets/images/icon_1.png";
import Icon2 from "@/assets/images/icon_2.png";
import { dwonloadFile } from "@/utils/func";
import { ElMessage } from "element-plus/lib/components/message";
import useStore from "./store";
export default defineComponent({
  components: { Echart, RuleAlert, Time },
  setup(props, { emit }) {
    const getToken = () => {
      return sessionStorage.getItem("token");
    };
    const router = useRouter();
    const route = useRoute();
    const isShow1 = computed(
      () => route.path.toLocaleLowerCase() == "/demandmanage/standingbook"
    );

    const isShow2 = computed(
      () => route.path.toLocaleLowerCase() != "/demandmanage/standingbook"
    );
    const isShow3 = computed(
      () => route.path.toLocaleLowerCase() !== "/demandmanage/scheduling"
    );
    const refUpload = ref<any>(null);
    const store = useStore();
    const navs = [
      { label: "导入需求", id: 1 },
      { label: "创建需求", id: 2 },
      { label: "创建排期", id: 3 },
    ];
    const dateTime = dayjs().format("YYYY年MM月DD日");
    const chartRef = ref<InstanceType<typeof Echart>>();
    //需求交付态势
    const option = {
      title: {
        top: "4%",
        text: "指标分布态势",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
        confine: true,
      },
      legend: {
        show: false,
      },
      grid: {
        left: "5%",
        right: "8%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        axisLabel: {
          fontSize: 12,
          interval: 0,
          rotate: -90,
          formatter: function (value: string, index: number) {
            if (index == 0) {
              return value.split("~")[0];
            } else {
              return value.split("~")[1];
            }
          },
        },
        type: "category",
        boundaryGap: false,
        data: <string[]>[],
      },
      yAxis: {
        type: "value",
        minInterval: 1,
      },
      series: [
        {
          name: "进行中",
          type: "line",
          data: <number[]>[],
          smooth: true,
          lineStyle: {
            color: "#e6a23c",
          },
          itemStyle: {
            color: "#e6a23c",
          },
        },
        {
          name: "超期",
          type: "line",
          data: <number[]>[],
          smooth: true,
          lineStyle: {
            color: "#d9001b",
          },
          itemStyle: {
            color: "#d9001b",
          },
        },
        {
          name: "上线",
          type: "line",
          // stack: "Total",
          data: <number[]>[],
          smooth: true,
          lineStyle: {
            color: "#67c23a",
          },
          itemStyle: {
            color: "#67c23a",
          },
        },
      ],
    };

    const state = reactive({
      key: "",
      dialogVisible: false,
      dialogVisible2: false,
      delay: "--",
      dueSoon: "--",
      hackReset: true, // 控制子组件显示
      fileList: [],
      // copy
      url: `/ddm-iic/dem/demand/importExcel`,
    });
    const onClick = (id: number) => {
      if (id === 1) {
        state.dialogVisible = true;
      } else if (id === 2) {
        store.createRequire = true;
        href("/demandManage/kanban");
      } else if (id === 3) {
        href("/demandManage/scheduling");
        store.createsChedule = true;
      }
    };
    const search = () => {
      router.push({
        path: "/demandManage/kanban",
        query: { searchWord: state.key },
      });
      state.key = "";
    };

    const showDialogVisible = () => {
      state.dialogVisible = true;
    };

    const handleCilck = (param: any) => {
      console.log(param);
    };
    const handleMapToggle = () => {
      emit("mapToggle");
    };

    // 上传成功
    const onSuccess = (res: any, file: any, filelsit: any) => {
      if (res.code != 200) {
        ElMessage({
          message: res.message,
          type: "warning",
          customClass: "msgZindex",
        });
        state.fileList = [];
        return;
      }
      ElMessage({
        message: res.message,
        type: "success",
        customClass: "msgZindex",
      });
      state.hackReset = false;
      nextTick(() => {
        state.hackReset = true;
      });
    };
    // 上传失败操作
    const onError = (res: any) => {
      state.fileList = [];
      ElMessage({
        message: res.message,
        type: "warning",
        customClass: "msgZindex",
      });
    };
    // 关闭弹出层
    const handleClose = () => {
      console.log(refUpload.value);
      refUpload.value.clearFiles();
      // if (router.currentRoute.value.path !== "/demandManage/kanban") {
      //   router.push("/demandManage/kanban");
      // }
    };
    // 搜索
    const handleSearchWord = () => {
      // if (state.searchWord) {
      //   router.push({
      //     path: "/demandManage/kanban",
      //     query: { searchWord: state.searchWord },
      //   });
      //   state.searchWord = "";
      // }
    };
    // 下载模板
    const handleDwonload = () => {
      dwonloadFile(
        1,
        `/ddm-iic/dem/demand/templateDownload?fileName=指标开发需求模板.xlsx`
      );
    };
    const href = (url: string, query?: any) => {
      router.push({ path: url, query: { ...query, datekey: Date.now() } });
    };

    const xAxis = option.xAxis;
    const series = option.series;
    const getDeliveryState = async () => {
      const res = await Api.deliveryState();
      if (res.code == 200) {
        const xy = res.result.xy;
        xAxis.data = [];

        Object.keys(res.result.xy).map((key, index) => {
          xAxis.data.push(key);
          const value = xy[key];
          const arr = value.split(",");
          series[0].data.push(parseInt(arr[0]));
          series[1].data.push(parseInt(arr[1]));
          series[2].data.push(parseInt(arr[2]));

          chartRef.value.echartInit();
          state.delay = res.result.delay;
          state.dueSoon = res.result.dueSoon;
        });
      }
    };
    getDeliveryState();
    return {
      href,
      Icon1,
      Icon2,
      refUpload,
      handleClose,
      handleDwonload,
      onSuccess,
      onError,
      Icondt,
      handleMapToggle,
      search,
      dateTime,
      navs,
      chartRef,
      option,
      onClick,
      getToken,
      isShow1,
      isShow2,
      isShow3,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.box {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
.m-sidebar {
  // width: 380px;
  margin-right: 10px;

  .time-con {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .icon_dt {
    width: 39px;
    height: 39px;
    margin-right: 4px;
  }

  .m-nav {
    display: flex;
    padding-top: 20px;
    padding-bottom: 20px;
    .navItem {
      width: 33.3%;
      padding: 0 8px;
      .btn {
        cursor: pointer;
        color: #fff;
        border-radius: 4px;
        background-color: #409eff;
        display: block;
        width: 100%;
        height: 100%;

        text-align: center;
        font-size: 12px;
      }
    }
  }
  .m-nav2 {
    display: flex;
    justify-content: space-between;
    text-decoration: underline;
    color: #7f7f7f;
    span {
      cursor: pointer;
    }
  }

  .m-search {
    display: flex;
    .el-input {
      flex: 1;
      margin-right: 10px;
    }
  }
  .statistics {
    padding: 20px 10px;
    margin-top: 10px;
  }
  .statistics-head {
    padding-bottom: 10px;

    border-bottom: 1px solid #ccc;
  }
  .statistics-num {
    display: flex;
  }
  .statistics-num-item {
    flex: 1;
    text-align: center;
    padding: 10px 4px;
    font-size: 14px;
    &:first-child {
      border-right: 1px solid #ccc;
    }
    .num {
      padding-left: 5px;
      font-size: 20px;
      color: rgb(217, 0, 27);
    }
  }
  .statistics-card {
    height: 420px;
    .chart_dom {
      height: 420px;
    }
  }
  .tip-text {
    font-size: 12px;
    width: 70%;
    margin: 0 auto;
  }
}

// =========弹窗==========

:deep(.el-dialog__header) {
  .el-dialog__close {
    font-size: 24px;
  }
}
:deep(.el-dialog) {
  border-radius: 30px;
}

.upload {
  :deep(.el-upload) {
    width: 100%;
  }
  :deep(.el-upload-dragger) {
    border-radius: 8px;
    border: 1px solid #e5e5e5;
    padding: 14px;
    height: 379px;
    width: 100%;
  }
  .upload_text {
    text-align: left;
    font-size: 16px;
    color: #aaaaaa;
  }
}

.dialog-footer {
  .el-button {
    width: 88px;
    height: 36px;
    min-height: 36px;
  }
}
</style>
