<template>
  <div class="MarketingMetrics">
    <div class="col_table">
      <div class="search"></div>
      <div class="col_btn">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="onCreate"
          >新增</el-button
        >
        <el-button
          type="success"
          icon="el-icon-refresh"
          size="small"
          :loading="isBtnLoading"
          @click="onRefresh"
          >刷新</el-button
        >
        <el-button type="primary" size="small" @click="handleMerge()"
          >合并</el-button
        >
      </div>
      <!-- 表格 -->
      <MyTable
        :border="true"
        :data="tableData"
        :column="tableColumn"
        is-pagination
        :isLoading="isLoading"
        empty-text="暂无数据"
        :pagination="pagination"
        @paginationChange="handleCurrentChange"
        @eventSelectionChange="handleSelectionChange"
        @paginationSizeChange="handleSizeChange"
      >
        <template #demandDomain="{ data }">
          <span>{{ data.row.demandDomain == 1 ? "任务" : "IT" }}</span>
        </template>
        <template #demandType="{ data }">
          <span>{{ data.row.demandType == 1 ? "指标开发" : "暂无" }}</span>
        </template>
        <template #progress="{ data }">
          <caProcess
            :sWidth="data.row.progress"
            :botBgColor="data.row.botBgColor"
            :topBgColor="data.row.topBgColor"
          ></caProcess>
        </template>
        <template #operation="{ data }">
          <div class="operation">
            <el-button type="primary" size="mini" @click="handleEdit(data.row)"
              >启动</el-button
            >
            <el-button type="info" size="mini" @click="handleDel(data.row)"
              >取消</el-button
            >
          </div>
        </template>
      </MyTable>
    </div>

    <el-dialog
      v-model="add_visible"
      :title="editType === 'save' ? '新增' : '编辑'"
      @closed="handleClose"
    >
      <MyForm
        ref="formRef"
        :form="queryData"
        status-icon
        :list="fromData"
        label-position="right"
        label-width="auto"
      >
        <template #submit>
          <div class="operation">
            <el-button type="primary" size="small" @click="handleSubmit"
              >保存</el-button
            >
          </div>
        </template>
      </MyForm>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  watch,
  nextTick,
} from "vue";
import hwTableMixins from "@/mixins/hwTableMixins";
import MyTable, { Colum } from "@/components/table/index.vue";
import caProcess from "@/components/process.vue";
import Service from "../api/index";
import MyForm from "@/components/Form/index.vue";
import { useConfirmDelete } from "@/utils/func";
import { ElMessage } from "element-plus/lib/components/message";
import { isAnyArrayBuffer } from "util/types";
import { useRoute } from "vue-router";
import useStore from "../component/store";
type StateType = {
  rowId: string;
  ids: any[];
  queryData: {
    demandType: string;
    demandDomain: string;
    startDate: string;
    endDate: string;
    demandIds: string;
    demand: any[];
    demandNames: string;
    headId: string;
    headName: string;
    onlineVersion: string;
  };
  fromData: any[];
  tableData: any[];
  tableColumn: Colum[];
  add_visible: Boolean;
  isBtnLoading: Boolean;
  editType: string;
};

export default defineComponent({
  components: {
    MyTable,
    caProcess,
    MyForm,
  },

  setup() {
    /****************************************** 初始化数据 **************************************************/
    const store = useStore();
    const formRef = ref<any>(null);
    const state = reactive<StateType>({
      rowId: "",
      ids: [],
      queryData: {
        demandType: "",
        demandDomain: "",
        startDate: "",
        endDate: "",
        demand: [],
        demandIds: "",
        demandNames: "",
        headId: "",
        headName: "",
        onlineVersion: "",
      },
      fromData: [
        {
          type: "select",
          label: "需求类型",
          name: "demandType",
          placeholder: "请选择类型",
          labelWidth: "80px",
          select: [{ label: "指标开发", value: "1" }],
          col: { span: 12 },
          rules: { required: true, message: "请选择类型", trigger: "blur" },
        },
        {
          type: "select",
          label: "需求领域",
          name: "demandDomain",
          placeholder: "请输入需求领域",
          labelWidth: "80px",
          select: [
            { label: "任务", value: "1" },
            { label: "IT", value: "2" },
          ],
          col: { span: 12 },
          rules: { required: true, message: "请输入需求领域", trigger: "blur" },
        },
        {
          type: "select",
          label: "负责人",
          name: "headId",
          placeholder: "请选择负责人",
          labelWidth: "80px",
          select: [],
          col: { span: 12 },
          rules: { required: true, message: "请选择负责人", trigger: "blur" },
        },
        {
          type: "text",
          label: "上线版本",
          name: "onlineVersion",
          placeholder: "请输入上线版本时间",
          col: { span: 12 },
          rules: {
            required: true,
            message: "请输入上线版本时间",
            trigger: "blur",
          },
        },
        {
          type: "date",
          label: "研发开始日期",
          name: "startDate",
          placeholder: "请选择研发开始日期",
          rules: {
            required: true,
            message: "请选择研发开始日期",
            trigger: "blur",
          },
        },
        {
          type: "date",
          label: "研发结束日期",
          name: "endDate",
          placeholder: "请选择研发结束日期",
          rules: {
            required: true,
            trigger: "change",
            validator: (rule: any, value: any, callback: any) => {
              if (value === "")
                return callback(new Error("请选择研发结束日期"));
              if (
                new Date(state.queryData.startDate).getTime() >
                new Date(value).getTime()
              )
                return callback(new Error("结束日期必须大于开始日期"));
              callback();
            },
          },
        },
        {
          type: "select",
          label: "需求范围",
          name: "demand",
          placeholder: "请选择需求范围",
          multiple: true,
          select: [],
          rules: { required: true, message: "请选择需求范围", trigger: "blur" },
        },
        { name: "submit", type: "slot", labelWidth: "0px" },
      ],
      tableColumn: [
        { type: "selection", width: "55px" },
        {
          label: "需求领域",
          prop: "demandDomain",
          minWidth: "100px",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          label: "需求类型",
          prop: "demandType",
          minWidth: "100px",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          label: "上线版本",
          prop: "onlineVersion",
          minWidth: "130px",
          showOverflowTooltip: true,
        },
        {
          label: "版本负责人",
          prop: "headName",
          minWidth: "100px",
          showOverflowTooltip: true,
        },
        {
          label: "开始日期",
          prop: "startDate",
          minWidth: "150px",
          showOverflowTooltip: true,
          sortable: true,
        },
        {
          label: "结束日期",
          prop: "endDate",
          sortable: true,
          minWidth: "150px",
        },
        { label: "进度状态", prop: "progress", minWidth: "210px", slot: true },
        {
          label: "操作",
          prop: "operation",
          width: "210px",
          slot: true,
          fixed: "right",
        },
      ],
      tableData: [],
      add_visible: false,
      isBtnLoading: false,
      editType: "save",
    });
    /****************************************** vue生命周期 **************************************************/

    onMounted(() => {
      getList();
    });
    /****************************************** 自定义click事件 **************************************************/
    // tabble刷新
    const onRefresh = async () => {
      state.isBtnLoading = true;
      await getList();
      setTimeout(() => {
        state.isBtnLoading = false;
      }, 500);
    };
    // 选择行
    const handleSelectionChange = (data: any) => {
      state.ids = [];
      data.map((item: any) => {
        state.ids.push(item.id + "");
      });
    };
    // 编辑
    const handleEdit = async (item: any) => {
      state.editType = "edit";
      const objItem: any = JSON.parse(JSON.stringify(item));
      let demandNames = objItem.demandNames.split(",");
      let demandIds = objItem.demandIds.split(",");
      let sData: any = [];
      demandIds.map((ite: any, index: number) => {
        sData.push(`${ite}@@${demandNames[index]}`);
      });
      objItem.demand = sData;
      objItem.headId = `${objItem.headId}@@${objItem.headName}`;
      state.queryData = objItem;
      state.rowId = objItem.rowId;
      onCreate();
    };

    // 删除
    const handleDel = async (item: any) => {
      const resul = await useConfirmDelete("是否删除?");
      if (resul) {
        const res = await Service.multifunction("delete", [item.rowId]);
        if (res.success) {
          ElMessage.success({
            message: "删除成功",
            type: "success",
          });
          getList();
        } else {
          ElMessage.success({
            message: "删除失败",
            type: "success",
          });
        }
      }
    };
    // 新增弹出
    const onCreate = () => {
      state.add_visible = true;
      getDemandList();
      getUserList();
    };

    // 关闭弹出层时清空表单数据
    const handleClose = () => {
      state.queryData = {
        demandType: "",
        demandDomain: "",
        startDate: "",
        endDate: "",
        demand: [],
        demandIds: "",
        demandNames: "",
        headId: "",
        headName: "",
        onlineVersion: "",
      };
      formRef.value?.resetForm(state.queryData);
    };

    //保存数据
    const handleSubmit = () => {
      formRef.value?.validate(async (valid: any) => {
        if (valid) {
          let meothod = "post";
          let ids: any = [];
          let names: any = [];
          let sData: any = JSON.parse(JSON.stringify(state.queryData));
          state.queryData.demand.map((item) => {
            ids.push(item.split("@@")[0]);
            names.push(item.split("@@")[1]);
          });
          sData.demandIds = ids.join(",");
          sData.demandNames = names.join(",");
          sData.headId = state.queryData.headId.split("@@")[0];
          sData.headName = state.queryData.headId.split("@@")[1];
          if (state.editType === "edit") {
            meothod = "put";
            sData.rowId = state.rowId;
          } else {
            // let num: any = state.queryData
            // sData.orderNum = parseInt(num);
          }
          const res = await Service.multifunction(meothod, sData);
          if (res.success)
            ElMessage.success({
              message: "成功",
              type: "success",
            });
          state.add_visible = false;
          state.editType = "save";
          getList();
        }
      });
    };
    // 合并排期
    const handleMerge = async () => {
      if (state.ids.length <= 1) {
        ElMessage({
          message: "请选择与谁合并!",
          type: "warning",
        });
        return;
      }
      const res = await Service.merge(state.ids);
      if (res.success)
        ElMessage({
          message: "合并成功",
          type: "success",
        });
      getList();
    };

    /****************************************** 自定义方法 **************************************************/
    // 获取需求信息集合
    const getDemandList = async () => {
      let sData = JSON.parse(JSON.stringify(comState.pagination));
      sData.limit = 500;
      sData.page = 1;
      const res = await Service.getList(delField(sData));
      state.fromData[6].select = [];
      res.result.records.map((item: any) => {
        let obj: any = { label: "", value: "" };
        obj.label = `${item.demandName}`;
        obj.value = `${item.rowId}@@${item.demandName}`;
        state.fromData[6].select.push(obj);
      });
    };

    // 获取用户列表
    const getUserList = async () => {
      const res = await Service.getUserList();
      state.fromData[2].select = [];
      res.result.map((item: any) => {
        let obj: any = { label: "", value: "" };
        obj.label = `${item.login_name}`;
        obj.value = `${item.row_id}@@${item.login_name}`;
        state.fromData[2].select.push(obj);
      });
    };

    // 获取弹出层类型数据
    const getList = async () => {
      comState.isLoading = true;
      state.tableData = [];
      const res = await Service.getscheduleList(delField(comState.pagination));
      if (res.result.records && res.result.records.length > 0) {
        res.result.records.map((item: any) => {
          let resutls = passTime(item.startDate, item.endDate, "");
          item["progress"] = resutls.num;
          //是否完成
          if (resutls.isSccomplish) {
            item["topBgColor"] = "#67c23a";
          } else {
            item["topBgColor"] = "#f56c6c"; //红色
          }

          //小于等于3天的时候用橘黄色
          if (resutls.differDay <= 3) {
            item["botBgColor"] = "#e6a23c"; // 橘色
          } else {
            item["botBgColor"] = "#c0ccda";
          }

          state.tableData.push(item);
        });
      }
      // debugger
      // state.tableData = res.result.records
      comState.pagination.total = res.result.total;
      setTimeout(() => {
        comState.isLoading = false;
      }, 300);
    };
    const { comState, handleSizeChange, handleCurrentChange, delField } =
      hwTableMixins(getList);

    function timeDiff(sTime: any, eTime: any) {
      let startTime = new Date(sTime);
      let endTime = new Date(eTime);
      let leftHour = 0;
      if (endTime.getTime() > startTime.getTime()) {
        let msDiff = endTime.getTime() - startTime.getTime();
        leftHour = Math.floor(msDiff / (1000 * 3600));
      }
      return leftHour;
    }
    function passTime(startTime: any, endTime: any, finishTime: any) {
      let sTime = new Date(startTime).getTime();
      let nowTime = Date.now(); //当前时间
      let eTime = new Date(endTime).getTime();
      let isSccomplish = true; // 默认完成
      let passHour = 0;
      //计算时间相差多少天
      let differDay = Math.floor((eTime - nowTime) / 1000 / 60 / 60 / 24);
      //当前时间比结束时间大则进度条走完100
      if (nowTime >= eTime) {
        passHour = 100;
      }

      //当前时间比开始时间大计算进度条位置
      if (nowTime > sTime) {
        let msDiff = nowTime - sTime;
        passHour = Math.ceil(msDiff / (1000 * 3600));
      }
      return {
        num: passHour * (100.0 / timeDiff(startTime, endTime)),
        differDay,
        isSccomplish,
      };
    }
    const route = useRoute();

    watch(
      () => route,
      () => {
        if (route.path.toLowerCase() !== "/demandmanage/scheduling") return;
        if (store.createsChedule) {
          store.createsChedule = false;
          onCreate();
        }
      },
      {
        deep: true,
        immediate: true,
      }
    );

    return {
      handleCurrentChange,
      handleSizeChange,
      handleEdit,
      handleDel,
      onCreate,
      onRefresh,
      handleSelectionChange,
      formRef,
      handleSubmit,
      handleMerge,
      handleClose,
      ...toRefs(state),
      ...toRefs(comState),
    };
  },
});
</script>
<style lang="scss" scoped>
.search {
  margin-top: 20px;
}
.col_table {
  padding: 0 20px;
  .col_btn {
    margin-bottom: 20px;
  }
}
.operation {
  width: 100%;
  text-align: center;
}
</style>
