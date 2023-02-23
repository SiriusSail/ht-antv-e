<template>
  <div class="MyHelp">
    <div class="statistical">
      <el-row :gutter="20">
        <el-col :span="6">
          <Statisticalcard
            title="我的求助统计"
            ref="refStatist1"
            :list="statisticalList1"
          />
        </el-col>
        <el-col :span="6">
          <Statisticalcard
            title="我的帮助统计"
            ref="refStatist2"
            :list="statisticalList2"
          />
        </el-col>
        <el-col :span="6">
          <Statisticalcard
            title="完成情况统计"
            ref="refStatist3"
            :list="statisticalList3"
          />
        </el-col>
        <el-col :span="6">
          <Statisticalcard
            title="未完成情况统计"
            ref="refStatist4"
            :list="statisticalList4"
          />
        </el-col>
      </el-row>
    </div>
    <div class="help-con">
      <div class="search-con">
        <Search
          @search="search"
          v-model="query.forHelpTitle"
          v-show="activeName === '0'"
        ></Search>
        <Search
          @search="search"
          v-model="query.helpTitle"
          v-show="activeName === '1'"
        ></Search>

        <el-button class="seekHelp-btn" type="primary" @click="InitiateHelp"
          >发起求助</el-button
        >
      </div>
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane label="我的求助" name="0">
          <Mytable
            stripe
            border
            :data="forHelpList"
            :column="forHelpColumn"
            is-pagination
            :pagination="forHelpPagination"
            @paginationChange="forHelpcurrentChange"
            @paginationSizeChange="forHelpSizeChange"
            :is-loading="forHelpLoading"
          >
            <template #status="{ data }">
              <div class="state-con">
                <!-- 状态(0=暂存，1=发起求助，2=沟通中，3=未解决，4=已解决，5=拒绝) -->
                <div v-if="data.row.status == 0" class="tag close">暂存</div>
                <div v-else-if="data.row.status == 1" class="tag success">
                  发起求助
                </div>
                <div v-else-if="data.row.status == 2" class="tag success">
                  沟通中
                </div>
                <div v-else-if="data.row.status == 3" class="tag refuse">
                  未解决
                </div>
                <div v-else-if="data.row.status == 4" class="tag success">
                  已解决
                </div>
                <div v-else-if="data.row.status == 5" class="tag refuse">
                  已拒绝
                </div>
              </div>
            </template>
            <template #operation="{ data }">
              <div class="operation">
                <el-button size="small" type="primary" @click="href(data.row)"
                  >查看详情</el-button
                >
              </div>
            </template>
          </Mytable>
        </el-tab-pane>

        <el-tab-pane label="我的帮助" name="1">
          <Mytable
            stripe
            border
            :data="helpList"
            :column="helpColumn"
            is-pagination
            :pagination="helpPagination"
            @paginationChange="helpcurrentChange"
            @paginationSizeChange="helpSizeChange"
            :is-loading="helpLoading"
          >
            <template #status="{ data }">
              <div class="state-con">
                <!-- 状态(0=暂存，1=发起求助，2=沟通中，3=未解决，4=已解决，5=拒绝) -->
                <div v-if="data.row.status == 0" class="tag close">暂存</div>
                <div v-else-if="data.row.status == 1" class="tag success">
                  发起求助
                </div>
                <div v-else-if="data.row.status == 2" class="tag success">
                  沟通中
                </div>
                <div v-else-if="data.row.status == 3" class="tag refuse">
                  未解决
                </div>
                <div v-else-if="data.row.status == 4" class="tag success">
                  已解决
                </div>
                <div v-else-if="data.row.status == 5" class="tag refuse">
                  已拒绝
                </div>
              </div>
            </template>
            <template #operation="{ data }">
              <div class="operation">
                <el-button size="small" type="primary" @click="href(data.row)"
                  >查看详情</el-button
                >
              </div>
            </template>
          </Mytable>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" custom-class="help-dialog" width="30%">
      <template #title>
        <div class="dialog-title">发起求助</div>
      </template>
      <MyForm
        ref="formRef"
        :form="form"
        status-icon
        :list="formList"
        label-position="right"
        label-width="70px"
      />

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="askForHelp">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  nextTick,
  onMounted,
} from "vue";
import { useRouter } from "vue-router";
import Statisticalcard from "./component/statistical-card.vue";

import Search from "@/components/Search/Search-input.vue";
import Mytable, { Colum, Pagination } from "@/components/table/index.vue";
import MyForm, { SelectItem } from "@/components/Form/index.vue";
import Api, { GetmyForHelpTypeResponse } from "./api/index";

type StateType = {
  activeName: string | number;
  form: {
    //查询
    forHelpType: string; //求助人
    forHelpDomain: string; //帮助人
  };
  formList: any[];
  statisticalList1: GetmyForHelpTypeResponse;
  statisticalList2: GetmyForHelpTypeResponse;
  statisticalList3: GetmyForHelpTypeResponse;
  statisticalList4: GetmyForHelpTypeResponse;
  forHelpList: any[];
  forHelpColumn: Colum[];
  forHelpPagination: Pagination;
  forHelpLoading: boolean;
  helpList: any[];
  helpColumn: Colum[];
  helpLoading: boolean;
  helpPagination: Pagination;
  query: {
    forHelpTitle: string;
    helpTitle: string;
  };
};

export default defineComponent({
  components: {
    Statisticalcard,
    Mytable,
    MyForm,
    Search,
  },
  setup() {
    const router = useRouter();
    const refStatist1 = ref(null);
    const refStatist2 = ref(null);
    const refStatist3 = ref(null);
    const refStatist4 = ref(null);
    const state = reactive<StateType>({
      activeName: "0", //选择
      query: {
        //查询
        forHelpTitle: "", //求助人标题查询
        helpTitle: "", //帮助人标题查询
      },
      form: {
        forHelpType: "", //求助类型
        forHelpDomain: "", //求助领域
      },
      formList: [
        {
          label: "求助类型",
          name: "forHelpType",
          type: "select",
          select: [],
        },
        {
          label: "求助领域",
          name: "forHelpDomain",
          type: "select",
          select: [],
        },
      ],
      // =======统计==============
      statisticalList1: {},
      statisticalList2: {},
      statisticalList3: {},
      statisticalList4: {},
      // =======求助人==============
      forHelpList: [],
      forHelpColumn: [
        {
          prop: "title",
          label: "求助标题",
          width: "auto",
          headerAlign: "left",
          align: "left",
        },
        {
          prop: "forHelpType",
          label: "求助类型",
          width: "100px",
        },
        {
          prop: "forHelpDomain",
          label: "求助领域",
          width: "100px",
        },
        {
          prop: "status",
          label: "状态",
          width: "100px",
          align: "center",
          slot: true,
        },
        {
          prop: "helpBy",
          label: "帮助人",
          width: "auto",
          align: "center",
        },
        {
          prop: "gmtCreate",
          label: "求助时间",
          width: "180px",
          align: "center",
        },
        {
          prop: "operation",
          slot: true,
          fixed: "right",
          label: "操作",
          width: "120px",
          align: "center",
        },
      ],
      forHelpPagination: {
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      forHelpLoading: true,
      // =======帮助人==============
      helpList: [],
      helpColumn: [
        {
          prop: "title",
          label: "求助标题",
          width: "auto",
          headerAlign: "left",
          align: "left",
        },
        {
          prop: "forHelpType",
          label: "求助类型",
          width: "100px",
        },
        {
          prop: "forHelpDomain",
          label: "求助领域",
          width: "100px",
        },
        {
          prop: "status",
          label: "状态",
          width: "100px",
          align: "center",
          slot: true,
        },
        {
          prop: "forHelpBy",
          label: "求助人",
          width: "auto",
          align: "center",
        },
        {
          prop: "gmtCreate",
          label: "求助时间",
          width: "180px",
          align: "center",
        },
        {
          prop: "operation",
          slot: true,
          fixed: "right",
          label: "操作",
          width: "120px",
          align: "center",
        },
      ],
      helpPagination: {
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      helpLoading: true,
    });
    const dialogVisible = ref(false);

    const InitiateHelp = () => {
      dialogVisible.value = true;
    };

    // 获取统计信息
    const getStatistics = () => {
      Api.getMyForHelpType().then((res) => {
        if (res.code == 200) {
          state.statisticalList1 = res.result;
          refStatist1.value.init(res.result);
        }
      });
      Api.getMyHelpType().then((res) => {
        if (res.code == 200) {
          state.statisticalList2 = res.result;
          refStatist2.value.init(res.result);
        }
      });
      Api.getFilished().then((res) => {
        if (res.code == 200) {
          state.statisticalList3 = res.result;
          refStatist3.value.init(res.result);
        }
      });
      Api.getUnFilished().then((res) => {
        if (res.code == 200) {
          state.statisticalList4 = res.result;
          refStatist4.value.init(res.result);
        }
      });
    };
    //搜索
    const search = () => {
      if (state.activeName === "0") {
        getForList();
      } else if (state.activeName === "1") {
        getHelpList();
      }
    };

    // 获取我的求助列表

    // 求助人==========================================
    const getForList = async () => {
      const res = await Api.getForHelpList({
        page: state.forHelpPagination.currentPage,
        limit: state.forHelpPagination.pageSize,
        title: state.query.forHelpTitle,
      });
      state.forHelpLoading = false;
      if (res.code == 200) {
        state.forHelpPagination.total = res.result.total;
        state.forHelpList = res.result.records;
      } else {
        Api.ElMessage.error(res.message);
      }
    };
    // 求助人分页
    const forHelpcurrentChange = () => {
      getForList();
    };
    // 求助人size大小改变
    const forHelpSizeChange = () => {
      getForList();
    };

    // 帮助人 ========================================
    //获取我的帮助列表
    const getHelpList = async () => {
      const res = await Api.getHelpList({
        page: state.helpPagination.currentPage,
        limit: state.helpPagination.pageSize,
        title: state.query.helpTitle,
      });
      if (res.code == 200) {
        state.helpLoading = false;
        state.helpPagination.total = res.result.total;
        state.helpList = res.result.records;
      } else {
        Api.ElMessage.error(res.message);
      }
    };
    //帮助人分页
    const helpcurrentChange = () => {
      getHelpList();
    };
    const helpSizeChange = (pageSize: number) => {
      getHelpList();
    };
    //=================其他==================
    const href = (row: any) => {
      if (row.status === "0") {
        router.push("/mySeekHelp?id=" + row.rowId);
      } else {
        router.push("/messageInfo?id=" + row.rowId);
      }
    };
    //切换tabs
    const changeTab = () => {
      state.query.forHelpTitle = "";
      state.query.helpTitle = "";

      if (state.activeName === "0") {
        getForList();
      } else if (state.activeName === "1") {
        getHelpList();
      }
    };

    const getDomain = async () => {
      const res = await Api.getDomain();
      if (res.code == 200) {
        const item = <SelectItem>(
          state.formList.find((v) => v.name == "forHelpDomain")
        );

        if (item) {
          const select: { label: string; value: string }[] = [];
          res.result.forEach((v) => {
            select.push({ label: v.dictLabel, value: v.dictValue });
          });
          item.select = select;
        }
      } else {
        Api.ElMessage.error(res.message);
      }
    };

    const getForHelpType = async () => {
      const res = await Api.getForHelpType();
      if (res.code == 200) {
        const item = <SelectItem>(
          state.formList.find((v) => v.name == "forHelpType")
        );
        if (item) {
          const select: { label: string; value: string }[] = [];
          res.result.forEach((v) => {
            select.push({ label: v.dictLabel, value: v.dictValue });
          });
          item.select = select;
        }
      } else {
        Api.ElMessage.error(res.message);
      }
    };
    //跳转发起求助
    const askForHelp = async () => {
      router.push({ path: "/mySeekHelp", query: state.form });
      dialogVisible.value = false;
    };

    getStatistics();
    getForList();
    // getHelpList();
    getForHelpType();
    getDomain();

    onMounted(() => {
      // console.log("重新渲染");
    });

    return {
      ...toRefs(state),
      search,
      changeTab,
      dialogVisible,
      InitiateHelp,
      forHelpcurrentChange,
      forHelpSizeChange,
      // ==================
      helpcurrentChange,
      helpSizeChange,
      href,
      askForHelp,
      refStatist1,
      refStatist2,
      refStatist3,
      refStatist4,
    };
  },
});
</script>
<style scoped lang="scss">
.MyHelp {
  padding: 30px;
  background-color: #f6f8fb;
  :deep(.labelheader) {
    // background-color: #dfecff;
    color: #475669;
    font-weight: 600;
    font-size: 14px;
  }
  :deep(.el-tabs__nav) {
    margin-left: 46px;
    .el-tabs__item {
      font-weight: 700;
    }
  }
  :deep(.el-tabs__content) {
    padding: 0 20px;
    padding-bottom: 30px;
  }
  .help-con {
    margin-top: 30px;
    background-color: #fff;
    box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  .search-con {
    display: flex;
    justify-content: flex-end;
    padding: 22px 30px;
    padding-bottom: 0px;
  }

  .seekHelp-btn {
    margin-left: 60px;
  }
  .state-con {
    display: flex;
    align-items: center;
    justify-content: center;
    .tag {
      padding: 0px 10px;
      font-size: 12px;
      border-radius: 20px;
      border: 1px solid #4194e7;
      color: #4194e7;
    }
    .default {
      border: 1px solid #4194e7;
      color: #4194e7;
    }
    .success {
      color: #34bf51;
      border: #34bf51 1px solid;
    }
    .refuse {
      color: #e77441;
      border: #e77441 1px solid;
    }
    .close {
      color: #9aa6b2;
      border: #9aa6b2 1px solid;
    }
  }
}
:deep(.help-dialog) {
  border-radius: 10px;
  .el-dialog__header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-color: #ecf4ff;
  }
}
</style>
