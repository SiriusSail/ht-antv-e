<template>
  <div class="m-sidebar">
    <div class="box">
      <div class="time-con">
        <div class="time"><Time></Time></div>
        <img class="icon_dt" :src="Icondt" @click="handleMapToggle" alt="" />
      </div>
      <div class="m-search">
        <el-input v-model="key" placeholder="指标查询"> </el-input>
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
        <span @click="handleDwonload">下载指标体系模板</span>
      </div>
    </div>

    <div class="statistics box">
      <div class="statistics-head">
        <div class="statistics-num">
          <div class="statistics-num-item">
            <span class="label">指标在线</span>
            <span class="num">{{ domainTotal }}</span>
          </div>
          <div class="statistics-num-item disable-text">
            <span class="label">指标体系成熟</span>
            <span class="num disable-text">--</span>
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
    <el-dialog v-model="dialogVisible" class="h-dialog" width="55%">
      <!-- 指标导入 -->
      <div class="upload">
        <el-upload
          class="upload-demo"
          drag
          action="/ddm-iic/help/iichelp/attachmentUpload"
          limit="1"
          :auto-upload="false"
          :headers="{
            'cas-token': getToken(),
          }"
          ref="uploadRef"
          :on-exceed="onExceed"
          :on-success="onSuccess"
        >
          <div class="upload_text">拖拉指标模板文件到这里</div>
        </el-upload>
      </div>
      <template #title>指标导入 </template>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="uploadFile">导入</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogVisible2" class="h-dialog" width="80%">
      <RuleAlert></RuleAlert>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import Echart from "@/components/Echart/index.vue";
import dayjs from "dayjs";
import RuleAlert from "@/views/RuleCoding/index2.vue";
import Api from "../api/index";
import { DownloadBlob } from "@/utils/func";
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  nextTick,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import Time from "@/components/Time/index.vue";
import Icondt from "@/assets/images/icon_dt.png";
import * as Element from "element-plus";
const { ElMessage } = Element;
export default defineComponent({
  components: { Echart, RuleAlert, Time },
  setup(props, { emit }) {
    const router = useRouter();
    const route = useRoute();
    const navs = [
      { label: "导入指标体系", id: 1, disable: true },
      { label: "指标编码标准", id: 2 },
      { label: "指标配置", id: 3 },
    ];
    const dateTime = dayjs().format("YYYY年MM月DD日");
    const chartRef = ref<InstanceType<typeof Echart>>();
    const uploadRef = ref<any>();

    const option = {
      title: {
        top: "10%",
        text: "指标分布态势",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      // legend: {
      //   left: "center",
      //   top: "bottom",
      // },

      series: [
        {
          name: "指标分布态势",
          type: "pie",
          label: {
            show: true,
            position: "inside",
            formatter: "{b}",
            textStyle: {
              align: "center",
              baseline: "middle",
              color: "#fff",
            },
          },
          data: <{ value: string; name: string; type: string }[]>[],
        },
      ],
    };

    const state = reactive({
      key: "",
      dialogVisible: false,
      dialogVisible2: false,
      domainTotal: "--",
    });
    const onClick = (id: number) => {
      if (id === 1) {
        state.dialogVisible = true;
      } else if (id === 2) {
        state.dialogVisible2 = true;
      } else if (id === 3) {
        router.push("/flowchart/index");
      }
    };
    const search = () => {
      href("/indexOnline/index", { key: state.key });
      state.key = "";
    };
    const showDialogVisible = () => {
      state.dialogVisible = true;
    };
    const handleDwonload = () => {
      Api.attachmentDownload().then((res) => {
        DownloadBlob(
          res.data,
          res.headers["content-type"],
          decodeURIComponent(
            res.headers["content-disposition"]
              .split(";")[1]
              .split("filename=")[1]
          )
        );
      });
    };

    const getDomainTotal = async () => {
      const res = await Api.getDomainTotal();
      if ((res.code = 200)) {
        state.domainTotal = res.result.total;
        const data = res.result.domians.map((item) => {
          return {
            value: item.total,
            name: item.domainName,
            type: item.domainValue,
          };
        });
        console.log(data);
        option.series[0].data = data;

        chartRef.value.echartInit();
        nextTick(() => {
          chartRef.value.myChart.on("click", handleCilck);
        });

        // console.log(option.value.series[0].data);
      }
    };
    getDomainTotal();
    const handleCilck = (param: any) => {
      console.log(param);
      href("/indexOnline/index", { domain: param.data.type });
    };
    const handleMapToggle = () => {
      if (route.path.toLocaleLowerCase() == "/indexonline/indexmap") {
        router.push("/indexonline/index");
      } else {
        router.push("/indexonline/indexmap");
      }
    };
    const href = (url: string, query?: any) => {
      router.push({ path: url, query: { ...query, datekey: Date.now() } });
    };
    const getToken = () => {
      return sessionStorage.getItem("token");
    };
    const onExceed = () => {
      ElMessage.warning("只能上传一个文件");
    };
    const uploadFile = () => {
      uploadRef.value.submit();
    };
    const onSuccess = (response: any) => {
      if (response.code == 200) {
        ElMessage.success(response.message);
        state.dialogVisible = false;
      } else {
        ElMessage.error(response.message);
      }
    };
    return {
      Icondt,
      handleMapToggle,
      search,
      handleDwonload,
      dateTime,
      navs,
      chartRef,
      option,
      onClick,
      ...toRefs(state),
      getToken,
      uploadRef,
      onExceed,
      uploadFile,
      onSuccess,
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
  width: 380px;
  margin-right: 10px;

  .time-con {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .icon_dt {
    cursor: pointer;
    width: 39px;
    height: 39px;
  }

  .m-nav {
    display: flex;
    padding-top: 20px;
    padding-bottom: 20px;
    .navItem {
      width: 33.3%;
      padding: 0 8px;
      .btn {
        border-radius: 4px;

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
