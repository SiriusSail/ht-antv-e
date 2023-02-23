<template>
  <div class="IndexOnline">
    <div>
      <!--  -->
      <div class="m-search">
        <IndexSearch :query="query" @search="search" />
      </div>

      <!-- 表格 -->
      <div class="table-con">
        <MyTable
          ref="mytable"
          border
          is-pagination
          :data="tableData"
          :column="tableColumn"
          row-key="rowId"
          lazy
          :tree-props="{ children: 'historyVersion' }"
          :isLoading="loading"
          :pagination="IndicatorLedgerPagination"
          @paginationChange="IndicatorLedgerChange"
          @paginationSizeChange="IndicatorLedgerSizeChange"
          @expand-change="expandChange"
          :expandRowKeys="expandRowKeys"
        >
          <template #index="{ data }">
            {{ data.row.index }}
          </template>
          <template #name="{ data }">
            <span v-if="data.row.historyVersion" @click="showChidren(data.row)">
              <em v-if="data.row.showChildren" class="el-icon-minus icon" />
              <em v-else class="el-icon-plus icon" />
            </span>
            <span class="history-null" v-else> </span>
            <span>{{ data.row.name }} </span>
          </template>
          <!-- 1.运行中，2.未开发，3.开发中，4.未启用，5.归档") -->
          <template #flowStatus="{ data }">
            <div class="flwStatus">
              <span v-if="data.row.flowStatus == 1">运行中</span>
              <span v-if="data.row.flowStatus == 2">未开发</span>
              <span v-if="data.row.flowStatus == 3">开发中</span>
              <span v-if="data.row.flowStatus == 4">未启用</span>
              <span v-if="data.row.flowStatus == 5">归档</span>
            </div>
          </template>
          <template #operation="{ data }">
            <div class="operation">
              <MyButton class="highlight" @click="setIndicatorId(data.row)"
                >详情</MyButton
              >
              <MyButton
                class="highlight"
                v-if="
                  data.row.releaseStatus != 1 &&
                  data.row.flowStatus != 5 &&
                  !data.row.operation
                "
                @click="releaseApi(data.row)"
                >发布API</MyButton
              >
              <MyButton
                class="highlight"
                v-else-if="
                  data.row.releaseStatus == 1 &&
                  data.row.flowStatus != 5 &&
                  !data.row.operation
                "
                @click="releaseApi(data.row)"
                >重新发布API</MyButton
              >
              <MyButton v-if="data.row.flowStatus != 5 && !data.row.operation"
                >开放</MyButton
              >

              <MyButton
                class="highlight"
                @click="jumpDataDevelopment(data.row)"
                v-if="data.row.flowStatus != 5 && !data.row.operation"
                >修订</MyButton
              >

              <MyButton
                class="highlight"
                @click="closeAndBackUp(data.row)"
                v-if="data.row.flowStatus != 5"
                >归档</MyButton
              >
              <MyButton v-if="data.row.flowStatus == 5">已归档</MyButton>

              <MyButton
                class="highlight"
                @click="execute(data.row)"
                v-if="data.row.flowStatus != 5 && !data.row.operation"
                >计算</MyButton
              >
              <MyButton
                class="highlight"
                @click="showRecommend(data.row)"
                v-if="data.row.flowStatus != 5 && !data.row.operation"
                >推荐</MyButton
              >
            </div>
          </template>
        </MyTable>
      </div>
      <div class="tabs-con" id="tabscon" v-if="queryId">
        <el-tabs v-model="activeName" class="tabs-con" @tab-click="handleClick">
          <el-tab-pane label="指标定义" name="0">
            <IndexDefinition ref="definitionRef" />
          </el-tab-pane>
          <el-tab-pane label="指标模型" name="1">
            <IndexModel ref="modelRef" />
          </el-tab-pane>
          <el-tab-pane label="指标固化" name="2">
            <IndexSolidification ref="solidificationRef" />
          </el-tab-pane>
          <el-tab-pane label="数据卡片" name="3">
            <!-- 正在开发中 -->
            <IndexCard ref="cardRef"></IndexCard>
          </el-tab-pane>
          <el-tab-pane label="指标血缘" name="4">
            <IndexlBoodKinship ref="boodKinshipRef" />
          </el-tab-pane>
          <el-tab-pane label="变更历史" disabled name="5">尽情期待</el-tab-pane>
          <el-tab-pane label="API接口" name="6">
            <ApiInfo ref="apiInfoRef" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="指标推荐"
      :close-on-click-modal="false"
      width="30%"
    >
      <Myform ref="formRef" :form="form" :list="recommendList"></Myform>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="recommend">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible2"
      @close="onClose"
      title="计算日志"
      width="50%"
    >
      <div class="logList" id="logList">
        <p v-for="item in computedInfo.logStr">
          {{ item.level }} {{ item.time }} {{ item.module }} {{ item.msg }}
        </p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible2 = false"
            >确定</el-button
          >
        </span>
      </template>
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
  nextTick,
  watch,
  onDeactivated,
} from "vue";
import IndexMap from "@/views/Home/busComponent/sales.vue";
import Myform, { InputItem } from "@/components/Form/index.vue";
import IndexSearch from "./IndexSearch.vue";
import MyTable, { Colum, Pagination } from "@/components/table/index.vue";
import Sidebar from "./Sidebar.vue";
import IndexSolidification from "./IndexSolidification.vue";
import IndexlBoodKinship from "./IndexlBoodKinship.vue";
import IndexModel from "./IndexModel.vue";
import IndexDefinition from "./IndexDefinition.vue";
import IndexCard from "./IndexCard.vue";
import ApiInfo from "./ApiInfo.vue";
import Api, { tableResult, getIicindflowPageQuery } from "../api/index";
import type { ExecuteItem } from "../api/index.d";
import { useRoute, useRouter } from "vue-router";
import dtImg from "@/assets/images/indexdt.png";
import dayjs from "dayjs";
import * as Element from "element-plus";
import { truncate } from "@antv/x6/lib/util/string/string";
const { ElMessageBox } = Element;

type tableRow = tableResult & {
  children?: tableResult[];
};
type StateType = {
  tableData: tableRow[];
  tableColumn: Colum[];
  activeName: string;
  expand: boolean;
  IndicatorLedgerPagination: Pagination;
  IndicatorLedgerLoading: boolean;
  expandRowKeys: string[];

  queryId: string; // 查询的ID
  query: getIicindflowPageQuery;
  loading: boolean;
  form: {
    flowId: string;
    description: string;
  };
  recommendList: InputItem[];
  dialogVisible: boolean;
  computedInfo: {
    logStr: ExecuteItem[];
  };
  dialogVisible2: boolean;
  computedIndex: number;
  timer: number;
};
const arr = [
  {
    label: "角色层",
    value: "1",
  },
  {
    label: "管理层",
    value: "2",
  },
  {
    label: "操作层",
    value: "3",
  },
  {
    label: "责任书",
    value: "4",
  },
  {
    label: "上市",
    value: "5",
  },
];

export default defineComponent({
  components: {
    IndexMap,
    IndexSearch,
    IndexSolidification,
    IndexlBoodKinship,
    MyTable,
    IndexModel,
    IndexDefinition,
    IndexCard,
    Sidebar,
    Myform,
    ApiInfo,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const mytable = ref();

    const state = reactive<StateType>({
      expandRowKeys: [], //展开的数据
      query: {
        domainCode: null,
        flowType: null,
        name: null,
        code: null,
        flowAttr: null,
      },
      queryId: null,
      activeName: "0",
      expand: true,
      IndicatorLedgerLoading: true,
      IndicatorLedgerPagination: {
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      tableColumn: [
        {
          label: "序号",
          align: "left",
          headerAlign: "center",
          prop: "index",
          minWidth: "80px",
          showOverflowTooltip: true,
          slot: true,
        },
        {
          label: "指标名称",
          align: "left",
          headerAlign: "center",
          prop: "name",
          minWidth: "150px",
          slot: true,
          showOverflowTooltip: true,
        },
        {
          label: "指标编码",
          prop: "code",
          width: "150px",
          align: "center",
          headerAlign: "center",
          showOverflowTooltip: true,
        },
        {
          label: "指标类型",
          prop: "flowType",
          width: "100px",
          align: "center",
          headerAlign: "center",
          showOverflowTooltip: true,
        },
        {
          label: "版本",
          prop: "version",
          width: "100px",
          align: "center",
          headerAlign: "center",
          showOverflowTooltip: true,
        },
        {
          label: "状态",
          prop: "flowStatus",
          width: "100px",
          align: "center",
          slot: true,
          headerAlign: "center",
          showOverflowTooltip: true,
        },
        {
          label: "启用日期",
          prop: "startDate",
          width: "120px",
          align: "center",
          sortable: true,
          headerAlign: "center",
          showOverflowTooltip: true,
          formatter(row) {
            if (row.startDate) {
              return dayjs(row.startDate).format("YYYY-MM-DD");
            } else {
              return "";
            }
          },
        },
        {
          label: "归档日期",
          prop: "closeDate",
          width: "100px",
          align: "center",
          headerAlign: "center",
          showOverflowTooltip: true,
          formatter(row) {
            if (row.closeDate) {
              return dayjs(row.closeDate).format("YYYY-MM-DD");
            } else {
              return "";
            }
          },
        },
        {
          label: "指标层级",
          prop: "flowLevel",
          width: "100px",
          align: "center",
          headerAlign: "center",
          showOverflowTooltip: true,
        },
        {
          label: "指标层次",
          prop: "gradation",
          width: "100px",
          align: "center",
          headerAlign: "center",

          showOverflowTooltip: true,
          formatter(row) {
            if (!row.gradation) {
              return "";
            }
            const c = <string[]>[];
            const a = row.gradation.split(",");
            a.forEach((item: string) => {
              const findItem = arr.find((itemc) => itemc.value == item);
              if (findItem) c.push(findItem.label);
            });
            return c.join(",");
          },
        },
        {
          label: "操作",
          prop: "operation",
          width: "265px",
          align: "left",
          headerAlign: "center",
          slot: true,
          fixed: "right",
        },
      ],
      tableData: [],
      loading: true,
      // 推荐
      form: {
        flowId: "",
        description: "",
      },
      recommendList: [
        {
          type: "textarea",
          name: "description",
          placeholder: "请输入推荐理由",
          rows: "10",
          rules: { required: true, message: "请输入推荐理由", trigger: "blur" },
        },
      ],
      computedInfo: {
        logStr: [],
      },
      dialogVisible2: false,
      dialogVisible: false,
      computedIndex: 0,
      timer: 0,
    });
    const formRef = ref<InstanceType<typeof Myform>>(null);
    //指标定义ref
    const definitionRef = ref<InstanceType<typeof IndexDefinition>>(null);
    //指标模型ref
    const modelRef = ref<InstanceType<typeof IndexModel>>(null);
    //指标模型ref
    const solidificationRef =
      ref<InstanceType<typeof IndexSolidification>>(null);
    //指标卡片ref
    const cardRef = ref<InstanceType<typeof IndexCard>>(null);
    //指标血缘ref
    const boodKinshipRef = ref<InstanceType<typeof IndexlBoodKinship>>(null);
    //Api接口
    const apiInfoRef = ref<any>(null);

    const handleClick = () => {
      if (state.activeName === "0") {
        definitionRef.value.request(state.queryId);
      } else if (state.activeName === "1") {
        modelRef.value.requset(state.queryId);
      } else if (state.activeName === "2") {
        solidificationRef.value.request(state.queryId);
      } else if (state.activeName === "3") {
        cardRef.value.request(state.queryId);
      } else if (state.activeName === "4") {
        boodKinshipRef.value.requset(state.queryId);
      } else if (state.activeName === "6") {
        apiInfoRef.value.requset(state.queryId);
      }
    };
    // 显示子级
    const showChidren = async (
      row: tableResult & {
        children: tableResult[];
        showChildren: boolean;
      }
    ) => {
      if (row.showChildren) {
        mytable.value.elTable.toggleRowExpansion(row, false);
      } else {
        mytable.value.elTable.toggleRowExpansion(row, true);
      }
    };

    // //获取子级接口
    // const getIicindflowPageChidren = async (parentId: string) => {
    //   return Api.getIicindflowPage({
    //     limit: 10000,
    //     page: 1,
    //     parentId,
    //   });
    // };
    // ==========================================
    //获取列表
    const getIicindflowPage = async () => {
      state.loading = true;
      const res = await Api.getIicindflowPage({
        limit: state.IndicatorLedgerPagination.pageSize,
        page: state.IndicatorLedgerPagination.currentPage,
        ...state.query,
      });
      state.IndicatorLedgerLoading = false;
      if (res.code === 200) {
        res.result.records.forEach((item, index) => {
          item.index = index + 1;

          item.showChildren = state.expandRowKeys.includes(item.rowId);
          if (item.historyVersion) {
            item.historyVersion.forEach((citem, cindex) => {
              citem.index = item.index + "." + (cindex + 1);
              citem.showChildren = state.expandRowKeys.includes(citem.rowId);
            });
          }
        });

        state.tableData = res.result.records;
        state.IndicatorLedgerPagination.total = res.result.total;
      }
      state.loading = false;
      console.log(mytable.value.elTable);
    };
    // 求助人分页
    const IndicatorLedgerChange = () => {
      getIicindflowPage();
    };
    // 求助人size大小改变
    const IndicatorLedgerSizeChange = () => {
      getIicindflowPage();
    };

    // 设置指标id
    const setIndicatorId = (item: tableResult) => {
      console.log(item.rowId);
      state.queryId = item.rowId;
      //触发一次点击的标签
      nextTick(() => {
        handleClick();
        document.getElementById("tabscon").scrollIntoView();
      });
    };

    //查询
    const search = () => {
      getIicindflowPage();
    };
    // 查询
    const onKeySearch = () => {
      state.query = {
        domainCode: null,
        flowType: null,
        name: null,
        code: null,
        flowAttr: null,
        parentId: null,
      };
      if (route.query.key) {
        state.query.name = route.query.key.toString();
      }
      const str = route.query.domain?.toString();
      if (str == "all") {
        state.query.domainCode = null;
      } else if (!str) {
        state.query.domainCode = "";
      } else {
        state.query.domainCode = str;
      }

      search();
    };

    //发布API
    const releaseApi = async (item: tableResult) => {
      const res = await Api.releaseApi(item.rowId);
      if (res.code == 200) {
        getIicindflowPage();
        Api.ElMessage.success(res.message);
        state.activeName = "6";
        setIndicatorId(item);
      } else {
        Api.ElMessage.error(res.message);
      }
    };

    //归档
    const closeAndBackUp = (item: tableResult) => {
      ElMessageBox.confirm("确认归档吗?", "归档警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const res = await Api.closeAndBackUp(item.rowId);
        if (res.code == 200) {
          getIicindflowPage();
        }
      });
    };

    //推荐
    const recommend = () => {
      formRef.value.validate(async (valid) => {
        console.log(valid);
        if (!valid) return;
        const res = await Api.recommend(state.form);
        if (res.code == 200) {
          getIicindflowPage();
          state.form = {
            flowId: "",
            description: "",
          };
          state.dialogVisible = false;
        }
      });
    };

    const pushLog = (logStr: ExecuteItem[]) => {
      clearTimeout(state.timer);
      const item = logStr[state.computedIndex];
      if (!item) {
        return;
      }
      state.computedInfo.logStr.push(item);
      state.computedIndex++;
      nextTick(() => {
        const div = document.getElementById("logList");
        if (div) {
          div.scrollTop = div.scrollHeight;
        }
      });
      state.timer = <any>setTimeout(() => {
        pushLog(logStr);
      }, 1000);
    };
    //计算
    const execute = async (item: tableResult) => {
      const res = await Api.execute(item.rowId);
      if (res.code == 200) {
        state.computedInfo.logStr = [];
        state.computedIndex = 0;

        pushLog(res.result.logStr);
        state.dialogVisible2 = true;
        getIicindflowPage();
      }
    };
    const onClose = () => {
      state.computedInfo.logStr = [];
    };
    // 显示弹窗
    const showRecommend = (item: tableResult) => {
      state.form = {
        flowId: "",
        description: "",
      };
      state.form.flowId = item.rowId;
      state.dialogVisible = true;
    };

    const jumpDataDevelopment = async (item: tableResult) => {
      router.push({
        name: "flowChart",
        params: {
          rowid: item.rowId,
        },
      });
    };

    watch(
      route,
      () => {
        if (route.path.toLocaleLowerCase() === "/indexonline/index") {
          onKeySearch();
        }
      },
      { immediate: true }
    );

    const expandChange = (expandedRows: any, expanded: boolean) => {
      if (expanded) {
        expandedRows.showChildren = true;
        const index = state.expandRowKeys.findIndex(
          (rowId) => rowId == expandedRows.rowId
        );
        if (index == -1) state.expandRowKeys.push(expandedRows.rowId);
      } else {
        expandedRows.showChildren = false;
        const index = state.expandRowKeys.findIndex(
          (rowId) => rowId == expandedRows.rowId
        );
        if (index > -1) state.expandRowKeys.splice(index, 1);
      }
      console.log();
      console.log(expanded, expandedRows.showChildren);
    };
    return {
      expandChange,
      onClose,
      formRef,
      definitionRef,
      modelRef,
      solidificationRef,
      cardRef,
      boodKinshipRef,
      apiInfoRef,
      setIndicatorId,
      showChidren,
      IndicatorLedgerSizeChange,
      IndicatorLedgerChange,
      recommend,
      showRecommend,
      execute,
      ...toRefs(state),
      handleClick,
      mytable,
      dtImg,
      search,

      releaseApi,
      closeAndBackUp,
      jumpDataDevelopment,
    };
  },
});
</script>
<style lang="scss" scoped>
.IndexOnline {
  padding: 10px 0;

  width: 100%;

  .history-null {
    display: inline-block;
    width: 18px;
  }
  :deep(.el-table) {
    .el-table__expand-icon {
      display: none;
    }
    .el-table__indent {
      padding-left: 0px !important;
    }
    .el-table__placeholder {
      width: 0px !important;
    }
    .icon {
      cursor: pointer;
    }
  }
  .index_name {
    display: inline-flex;
  }

  .operation {
    .el-button {
      cursor: pointer;
      padding: 0;
      border: 0;
      background: none;
      min-height: 0;
      margin: 0;
      margin-right: 4px;
      &:hover {
        color: none;
      }
    }
    .highlight {
      color: #2082ff;
    }
  }
  .m-head {
    margin-top: 30px;
  }
  .m-search {
    margin-top: 20px;
  }
  .tabs-con {
    background-color: #fff;
    border-radius: 8px;
  }
  :deep(.el-tab-pane) {
    min-height: 400px;
  }
  :deep(.el-tabs__nav-wrap) {
    padding-left: 44px;
    &.is-scrollable {
      padding: 0 20px;
    }
  }
  :deep(.el-tabs__content) {
    padding: 0 10px;
  }

  .tabs-con {
    margin-top: 20px;
  }
  .indexdt {
    width: 80%;
    display: block;
    margin: 0 auto;
  }
  .logList {
    min-height: 100px;
    max-height: 300px;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    // height: 100px;
    padding: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    p {
      line-height: 2;
    }
  }
}
</style>
