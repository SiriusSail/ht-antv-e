<template>
  <Mytable
    border
    :isLoading="isLoading"
    :data="list"
    :column="column"
    :is-pagination="true"
    :pagination="pagination"
    @paginationChange="handleCurrentChange"
    @paginationSizeChange="handleSizeChange"
    @row-click="rowClick"
    cell-class-name="pointer"
  >
  </Mytable>
</template>
<script lang="ts" setup>
import { defineComponent, ref, reactive, toRefs } from "vue";
import Mytable, { Colum, Pagination } from "@/components/table/index.vue";
import { devList } from "@/views/Empowerment/api/index";
import type { DevType } from "@/views/Empowerment/api/types/index";
import { deepCopy } from "@/utils/func";
import { defaultPagination, rowClick } from "./common";

type stateProps = {
  column: Colum[];
  list: DevType[];
  pagination: Pagination;
  isLoading: boolean;
};

const state = reactive<stateProps>({
  list: [],
  isLoading: false,
  pagination: deepCopy(defaultPagination),
  column: [
    {
      prop: "refName",
      label: "名称",
      minWidth: "100px",
      showOverflowTooltip: true,
    },
    {
      prop: "gmtCreate",
      label: "创建时间",
      minWidth: "100px",
      showOverflowTooltip: true,
    },
  ],
});

//页数改变
const handleCurrentChange = () => {
  getData();
};
// 分页大小改变
const handleSizeChange = () => {
  getData();
};
//获取列表All
const getData = async () => {
  state.isLoading = true;
  const res = await devList({
    limit: state.pagination.pageSize,
    page: state.pagination.currentPage,
  });
  if (res.code == 200) {
    state.list = res.result.records;
    state.pagination.total = res.result.total;
  } else {
  }
  state.isLoading = false;
};

getData();
const { pagination, column, list, isLoading } = toRefs(state);
</script>
<style scoped lang="scss"></style>
