<template>
  <div class="h-table">
    <el-table
      ref="elTable"
      class="table_col"
      v-loading="isLoading"
      header-cell-class-name="labelheader"
      empty-text="暂无数据"
      v-bind="$attrs"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        v-if="isSelection"
        align="center"
        width="60px"
      />
      <!-- 有插槽 -->
      <el-table-column
        v-for="item in column"
        :key="item.prop"
        align="center"
        headerAlign="center"
        v-bind="item"
      >
        <template v-if="item.slot" #default="scope">
          <slot :data="scope" :name="item.prop" />
        </template>
      </el-table-column>
    </el-table>
  </div>

  <div v-if="isPagination" class="pagination">
    <el-pagination
      background
      @current-change="currentChange"
      @size-change="handleSizeChange"
      v-bind="pagination"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, PropType } from "vue";
import {
  ElTable,
  ElTableColumn,
  ElLoadingDirective,
  ElRadioGroup,
  ElRadio,
  ElCheckbox,
  ElCheckboxGroup,
} from "../../../node_modules/element-plus";
export interface Colum {
  type?: "selection" | "index" | "expand";
  index?: number | ((index: number) => {});
  label?: string;
  columnKey?: string;
  prop?: string | number;
  width?: string | number;
  minWidth?: string | number;
  fixed?: "left" | "right";
  renderHeader?: (data: any) => {};
  resizable?: boolean;
  formatter?: (row: any, column: any, cellValue: any, index: any) => {};
  showOverflowTooltip?: boolean;
  align?: "left" | "center" | "right";
  headerAlign?: "left" | "center" | "right";
  className?: string;
  labelClassName?: string;
  selectable?: (row: any, index: any) => {};
  filters?: { text: any; value: any }[];
  filterPlacement?: string;
  filterMultiple?: boolean;
  sortable?: boolean;
  slot?: boolean; // 是否开启插槽
}

export type Pagination = {
  layout: string;
  total: number;
  currentPage: number;
  pageSize: number;
  pageSizes?: number[];
  hideOnSinglePage?: boolean;
  disabled?: boolean;
  prevText?: string;
  nextText?: string;
  small?: boolean;
};

export default defineComponent({
  // eslint-disable-next-line vue/no-unused-components
  components: {
    ElTable,
    ElTableColumn,
    ElRadioGroup,
    ElRadio,
    ElCheckbox,
    ElCheckboxGroup,
  },
  directives: {
    loading: ElLoadingDirective,
  },
  props: {
    column: {
      type: Array as PropType<Colum[]>,
      required: true,
      default: (): Array<Colum> => [],
    },
    isPagination: {
      // 是否分页
      type: Boolean,
      default: false,
    },
    isLoading: {
      // 是否显示加载动画
      type: Boolean,
      default: false,
    },
    isSelection: {
      type: Boolean,
      default: false,
    },

    pagination: {
      type: Object as PropType<Pagination>, // 分页配置
      default: () => {
        return {
          layout: "total, sizes, prev, pager, next, jumper",
          total: 0,
          currentPage: 1,
          pageSize: 10,
        };
      },
    },
  },
  emits: ["paginationChange", "paginationSizeChange", "eventSelectionChange"],

  setup(props, { emit }) {
    const { pagination } = toRefs(props);
    const elTable = ref();
    const state = reactive({});
    const currentChange = (page: number) => {
      pagination.value.currentPage = page;
      emit("paginationChange", page);
    };
    const handleSizeChange = (pageSize: number) => {
      pagination.value.pageSize = pageSize;
      emit("paginationSizeChange", pageSize);
    };
    const handleSelectionChange = (val: any) => {
      emit("eventSelectionChange", val);
    };

    return {
      elTable,
      currentChange,
      handleSizeChange,
      handleSelectionChange,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.table_col {
  width: 100%;
  --el-table-border: 1px solid #c0ccda;
  --el-table-border-color: #c0ccda; //缺少的颜色
  --el-border-color-lighter: #c0ccda; //缺少的颜色

  :deep(.el-table__fixed) {
    height: 100% !important;
  }

  :deep(.el-table__body-wrapper.is-scrolling-none ~ .el-table__fixed-right) {
    height: 100% !important;
  }
}
.pagination {
  margin-top: 20px;
  text-align: right;
}
.table_col {
  :deep(.labelheader) {
    background-color: #dfecff;
    color: #475669;
    font-weight: 600;
    font-size: 14px;
  }
}
</style>
