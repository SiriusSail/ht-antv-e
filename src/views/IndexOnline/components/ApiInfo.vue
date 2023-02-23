<template>
  <div v-if="info.url" class="ApiInfo">
    <p class="apiUrl">接口地址：{{ info.url }}</p>
    <p class="desciption">描述:{{ info.desciption }}</p>

    <div class="api-con">
      <div class="box">
        <p class="text">输入参数</p>
        <Mytable :data="requestParams" :column="paramsTbale"></Mytable>
      </div>
      <div class="box">
        <p class="text">输出参数：</p>
        <Mytable :data="responseResult" :column="resultTbale"></Mytable>
      </div>
    </div>
  </div>
  <el-empty v-else description="暂无接口"></el-empty>
</template>
<script lang="ts" setup>
import { defineComponent, ref, reactive, toRefs, defineExpose } from "vue";
import Api from "../api/index";
import type { RequestParam, ResponseResult } from "../api/index.d";
import Mytable, { Colum } from "@/components/table/index.vue";

type State = {
  info: { desciption: string; url: string };
  requestParams: RequestParam[];
  responseResult: ResponseResult[];
  paramsTbale: Colum[];
  resultTbale: Colum[];
};
const state = reactive<State>({
  info: {
    desciption: "",
    url: "",
  },
  requestParams: [],

  paramsTbale: [
    {
      prop: "name",
      label: "字段名",
    },
    {
      prop: "type",
      label: "类型",
    },
    {
      prop: "description",
      label: "描述",
    },
  ],
  responseResult: [],
  resultTbale: [
    {
      prop: "name",
      label: "字段名",
    },
    {
      prop: "type",
      label: "类型",
    },
    {
      prop: "description",
      label: "描述",
    },
  ],
});

const requset = async (rowId: string) => {
  const res = await Api.ApiInfo(rowId);
  if (res.code == 200 && res.result.url) {
    state.info.desciption = res.result.desciption;
    state.info.url = res.result.url;
    state.requestParams = res.result.requestParams;
    state.responseResult = res.result.responseResult;
  } else {
    state.info.url = "";
  }
};
const { info, paramsTbale, responseResult, requestParams, resultTbale } =
  toRefs(state);
defineExpose({ requset });
</script>
<style scoped lang="scss">
.ApiInfo {
  color: #606266;
  font-size: 14px;
  .apiUrl {
    padding-bottom: 10px;
  }
  .desciption {
    padding-bottom: 10px;
  }
  .api-con {
    .box {
      padding-top: 20px;
    }
    .text {
      font-size: 16px;
      font-size: #333;
      padding-bottom: 10pxx;
    }
  }
}
</style>
