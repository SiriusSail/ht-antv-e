<template>
  <div class="MarketingMetrics">
    <div class="col_table">
      <div class="search">
        <MyForm ref="refSearch"
                :form="querySearchData"
                status-icon
                :list="fromSearchData"
                label-position="right"
                label-width="auto">
          <template #submit>
            <el-button type="primary"
                       @click="handleSerach">查询</el-button>
          </template>
        </MyForm>
      </div>
      <!-- 表格 -->
      <MyTable border
               :data="tableData"
               :column="tableColumn"
               is-pagination
               :isLoading="isLoading"
               empty-text="暂无数据"
               :pagination="pagination"
               @paginationChange="handleCurrentChange"
               @paginationSizeChange="handleSizeChange">
      </MyTable>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, toRefs, onMounted, } from "vue";
  import hwTableMixins from "@/mixins/hwTableMixins";
  import MyTable, { Colum } from "@/components/table/index.vue";
  import Service from "./api/index";
  import MyForm from "@/components/Form/index.vue";

  type StateType = {
    querySearchData: {
      title: string;
    };
    fromSearchData: any[];
    tableData: any[];
    tableColumn: Colum[];
  };

  export default defineComponent({
    components: {
      MyTable,
      MyForm
    },

    setup () {
      /****************************************** 初始化数据 **************************************************/

      const formRef = ref<any>(null);
      const state = reactive<StateType>({
        querySearchData: {
          title: "",
        },
        fromSearchData: [
          {
            type: "text",
            label: "标题：",
            name: "title",
            placeholder: "请输入标题",
            labelWidth: "90px",
            col: { span: 5 },
          },
          { name: "submit", type: "slot", labelWidth: "10px", col: { span: 1 } },
        ],


        tableColumn: [
          {
            label: "日志标题", prop: "title", minWidth: "80px", showOverflowTooltip: true,
          },
          {
            label: "IP地址", prop: "remoteAddr", minWidth: "80px", showOverflowTooltip: true, slot: true,
          },
          {
            label: "请求URI",
            prop: "requestUri",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "参数",
            prop: "params",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "操作方式",
            prop: "method",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "用户代理",
            prop: "userAgent",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            minWidth: "150px",
            showOverflowTooltip: true
            , sortable: true
          },
          {
            label: "异常信息",
            prop: "exception",
            minWidth: "250px",
            showOverflowTooltip: true,
            slot: true,
          }
        ],
        tableData: []
      });
      /****************************************** vue生命周期 **************************************************/
      onMounted(() => {
        getList();

      });

      /****************************************** 自定义click事件 **************************************************/

      // tabble查询
      const handleSerach = () => {
        let bData: any = JSON.parse(JSON.stringify(state.querySearchData));
        comState.pagination = { ...comState.pagination, ...bData };
        getList();
      };

      /****************************************** 自定义方法 **************************************************/

      // 获取弹出层类型数据
      const getList = async () => {
        comState.isLoading = true;
        const res = await Service.getList(delField(comState.pagination));
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
  }
  .operation {
    width: 100%;
    text-align: center;
  }
</style>
