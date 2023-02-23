<template>
  <div class="MarketingMetrics">
    <div class="col_table">
      <div class="search">
        <MyForm
          ref="refSearch"
          :form="queryData"
          status-icon
          :list="fromData"
          label-position="right"
          label-width="auto"
        >
          <template #submit>
            <el-button type="primary" @click="handleSerach">查询</el-button>
          </template>
        </MyForm>
      </div>
      <!-- 表格 -->
      <MyTable
        border
        :data="tableData"
        :column="tableColumn"
        is-pagination
        :isLoading="isLoading"
        empty-text="暂无数据"
        :pagination="pagination"
        @paginationChange="handleCurrentChange"
        @paginationSizeChange="handleSizeChange"
      >
        <template #reviewState="{ data }">
          <span v-if="data.row.reviewState == 1">待开始</span>
          <span v-if="data.row.reviewState == 2">进行中</span>
          <span v-if="data.row.reviewState == 3">已完成</span>
          <span v-if="data.row.reviewState == 4">已验收</span>
          <span v-if="data.row.reviewState == 5">已拒绝</span>
          <span v-if="data.row.reviewState == 6">待确定</span>
        </template>
      </MyTable>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, toRefs, onMounted } from "vue";
import hwTableMixins from "@/mixins/hwTableMixins";
import MyTable, { Colum } from "@/components/table/index.vue";
import Service from "../api/index";
import MyForm from "@/components/Form/index.vue";

type StateType = {
  rowId: string;
  queryData: {
    processName: string;
    orderField: string;
    applicant: string;
    order: string;
  };
  fromData: any[];
  tableData: any[];
  tableColumn: Colum[];
};

export default defineComponent({
  components: {
    MyTable,
    MyForm,
  },

  setup() {
    /****************************************** 初始化数据 **************************************************/
    const state = reactive<StateType>({
      rowId: "",
      queryData: {
        processName: "",
        orderField: "gmt_create",
        applicant: "",
        order: "desc",
      },
      fromData: [
        {
          type: "text",
          label: "流程名称",
          name: "processName",
          placeholder: "请输入流程名称",
          labelWidth: "80px",
          col: { span: 5 },
        },
        {
          type: "text",
          label: "申请人",
          name: "applicant",
          placeholder: "请输入申请人",
          labelWidth: "70px",
          handle: () => {
            handleSerach();
          },
          col: { span: 5 },
        },
        { name: "submit", type: "slot", labelWidth: "10px", col: { span: 1 } },
      ],
      tableColumn: [
        {
          label: "申请人",
          prop: "applicant",
          minWidth: "70px",
          showOverflowTooltip: true,
        },
        {
          label: "指标名称",
          prop: "indName",
          minWidth: "80px",
          showOverflowTooltip: true,
        },
        {
          label: "是否一次性通过",
          prop: "isOneTimePass",
          minWidth: "120px",
          showOverflowTooltip: true,
        },
        {
          label: "申请日期",
          prop: "processDate",
          minWidth: "80px",
          showOverflowTooltip: true,
        },
        {
          label: "流程名称",
          prop: "processName",
          minWidth: "80px",
          showOverflowTooltip: true,
        },
        {
          label: "审批信息",
          prop: "reviewInfo",
          minWidth: "80px",
          showOverflowTooltip: true,
        },
        {
          label: "审批状态",
          prop: "reviewState",
          minWidth: "80px",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          label: "评审数量",
          prop: "reviewsNumber",
          minWidth: "80px",
          showOverflowTooltip: true,
        },
        {
          label: "创建时间",
          prop: "gmtCreate",
          minWidth: "160px",
          showOverflowTooltip: true,
          sortable: true,
        },
        {
          label: "更新时间",
          prop: "gmtModified",
          sortable: true,
          minWidth: "150px",
        },
      ],
      tableData: [],
    });
    /****************************************** vue生命周期 **************************************************/
    onMounted(() => {
      getList();
    });

    /****************************************** 自定义click事件 **************************************************/
    // tabble查询
    const handleSerach = () => {
      comState.pagination = { ...comState.pagination, ...state.queryData };
      getList();
    };

    /****************************************** 自定义方法 **************************************************/

    // 获取弹出层类型数据
    const getList = async () => {
      comState.isLoading = true;
      const res = await Service.demandaccountList(
        delField(comState.pagination)
      );
      state.tableData = res.result.records;
      comState.pagination.total = res.result.total;
      setTimeout(() => {
        comState.isLoading = false;
      }, 300);
    };
    const { comState, handleSizeChange, handleCurrentChange, delField } =
      hwTableMixins(getList);
    return {
      handleCurrentChange,
      handleSizeChange,
      handleSerach,
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
