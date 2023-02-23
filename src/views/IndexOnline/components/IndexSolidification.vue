<template>
  <div class="IndexSolidification">
    <el-row class="IndexSolidification_state">
      <el-col :span="6">
        执行状态：
        <span v-if="form.healthStatus <= 1" class="success"> 成功 </span>
        <span v-else-if="0">--</span>
        <span v-else class="error"> 失败 </span>
      </el-col>
      <el-col :span="6">上次运算日期：{{ form.lastSyncTime || "--" }}</el-col>
      <el-col :span="8">下次运算日期：{{ form.nextSyncTime || "--" }}</el-col>
      <el-col :span="4">
        <el-button type="primary" disabled>数据重跑</el-button>
      </el-col>
    </el-row>
    <div class="hr"></div>
    <MyForm
      ref="formRef"
      :form="form"
      status-icon
      :list="list2"
      label-position="right"
      label-width="130px"
    >
      <template #monthRight>
        <span style="padding-left: 8px">月</span>
      </template>
      <template #dayRight>
        <span style="padding-left: 8px">号</span>
      </template>
    </MyForm>

    <div class="footer">
      <el-button type="primary" @click="submit">修改指标固化</el-button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch, nextTick } from "vue";
import Api, { Solidify, EditSolidify } from "../api/index";
import MyForm, {
  InputItem,
  RadioGroupItem,
  SelectItem,
  CheckboxGroupItem,
  CheckboxItem,
  TimePickerItem,
} from "@/components/Form/index.vue";

import dayjs from "dayjs";

type StateType = {
  list2: (
    | InputItem
    | RadioGroupItem
    | SelectItem
    | CheckboxGroupItem
    | CheckboxItem
    | TimePickerItem
  )[];
  form: Solidify;
};
const getSelect = (min: number, max: number) => {
  const arr: { label: string; value: string }[] = [];

  for (let index = min; index <= max; index++) {
    arr.push({
      label: index.toString(),
      value: index.toString(),
    });
  }
  return arr;
};

export default defineComponent({
  components: {
    MyForm,
  },
  setup() {
    const formRef = ref<InstanceType<typeof MyForm>>();

    const yearItem: SelectItem = {
      name: "month",
      label: "每年的第",
      type: "select",
      col: {
        span: 7,
      },
      rules: {
        required: true,
        message: "请选择时间",
      },
      select: getSelect(1, 12),
      rightSlot: "monthRight",
    };
    const monthItem: SelectItem = {
      label: "每月的",
      name: "day",
      type: "select",
      rightSlot: "dayRight",
      select: getSelect(1, 31),
      col: {
        span: 7,
      },
      rules: {
        required: true,
        message: "请选择时间",
      },
    };
    const weekItme: SelectItem = {
      name: "week",
      label: "每周星期",
      type: "select",
      col: {
        span: 7,
      },
      rules: {
        required: true,
        message: "请选择时间",
      },
      select: [
        { value: "1", label: "星期一" },
        { value: "2", label: "星期二" },
        { value: "3", label: "星期三" },
        { value: "4", label: "星期四" },
        { value: "5", label: "星期五" },
        { value: "6", label: "星期六" },
        { value: "7", label: "星期日" },
      ],
    };
    const dayItem: TimePickerItem = {
      label: "每天的",
      name: "time",
      type: "timePicker",
      col: {
        span: 7,
      },
      format: "HH:mm",
      rules: {
        required: true,
        message: "请选择时间",
      },
    };

    const staticArr: (
      | InputItem
      | RadioGroupItem
      | SelectItem
      | CheckboxGroupItem
      | CheckboxItem
      | TimePickerItem
    )[] = [
      {
        name: "syncEnable",
        type: "checkbox",
        label: "启用",
        trueLabel: 1,
        falseLabel: 0,
      },
      {
        name: "cycleType",
        type: "radioGroup",
        label: "执行周期",
        col: {
          span: 24,
        },
        select: [
          {
            label: "每年",
            value: 1,
          },
          {
            label: "每月",
            value: 2,
          },
          {
            label: "每周",
            value: 3,
          },
          {
            label: "每天",
            value: 4,
          },
        ],
      },
    ];
    // 指标固化表单
    const state = reactive<StateType>({
      form: {
        createBy: "",
        cron: "",
        cycleType: null,
        day: "", //天
        gmtCreate: "",
        gmtModified: "",
        healthStatus: null,
        id: null,
        lastSyncTime: "",
        modifiedBy: "",
        month: "", //月份
        nextSyncTime: "",
        repeatInterval: null,
        repeatTimes: null,
        rowId: "",
        syncEnable: null,
        time: null, //(hh:MM:ss)
        week: "", //周
        flowId: "",
      },
      list2: [],
    });
    watch(
      () => state.form.cycleType,
      () => {
        changeCycleType();
      }
    );
    //修改类型
    const changeCycleType = () => {
      if (state.form.cycleType == 1) {
        state.list2 = [...staticArr, yearItem, monthItem, dayItem];
      } else if (state.form.cycleType == 2) {
        state.list2 = [...staticArr, monthItem, dayItem];
      } else if (state.form.cycleType == 3) {
        state.list2 = [...staticArr, weekItme, dayItem];
      } else if (state.form.cycleType == 4) {
        state.list2 = [...staticArr, dayItem];
      } else {
        state.list2 = [...staticArr];
      }
    };

    const request = async (rowId: string) => {
      const res = await Api.getSolidify(rowId);
      if (res.code == 200) {
        state.form = res.result;
        state.form.time = res.result.time
          ? new Date("2016/9/10 " + res.result.time)
          : new Date("2016/9/10 00:00:00");

        changeCycleType();
      } else {
        Api.ElMessage.error(res.message);
      }
    };
    const submit = () => {
      const data: EditSolidify = {
        flowId: null,
        syncEnable: null,
        repeatTimes: 1,
        repeatInterval: 60,
        cycleType: 0,
        month: null,
        day: null,
        week: null,
        time: null,
      };

      formRef.value.validate(async (valid: any) => {
        if (valid) {
          data.flowId = state.form.flowId;
          data.syncEnable = state.form.syncEnable;
          data.cycleType = state.form.cycleType;
          data.week = state.form.week;
          data.time = dayjs(state.form.time).format("HH:mm:ss");
          if (state.form.cycleType == 1) {
            //每年的第几个月
            data.month = state.form.month;
            data.day = state.form.day;
          } else if (state.form.cycleType == 2) {
            //每周的
            data.day = state.form.day;
          } else if (state.form.cycleType == 3) {
            data.week = state.form.week;
          }
          const res = await Api.editSolidify(data);
          if (res.code == 200) {
            Api.ElMessage.success(res.message);
            request(state.form.flowId);
          } else {
            Api.ElMessage.error(res.message);
          }
        }
      });
    };
    return {
      request,
      formRef,
      submit,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.IndexSolidification {
  .hr {
    margin-top: 10px;
    margin-bottom: 10px;
    height: 1px;
    width: 100%;
    background-color: #ccc;
  }
  .IndexSolidification_state {
    padding-top: 10px;
    align-items: center;
  }
  .cronTip {
    display: flex;
    white-space: nowrap;
    span {
      margin-left: 10px;
      color: #20a0ff;
      text-decoration: underline;
      font-size: 12px;
    }
  }
  .retryTip {
    color: #aaaaaa;
    font-size: 12px;
    white-space: nowrap;
  }
  .footer {
    padding-top: 20px;
    // padding-left: 50px;
    text-align: center;
  }
  .success {
    color: #70b603;
  }
  .error {
    color: #d9001b;
  }
}
</style>
