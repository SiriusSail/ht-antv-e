<template>
  <div class="RuleCoding">
    <div class="m-head">
      <div class="search">
        <Myform
          ref="searchRef"
          label-width="100px"
          :form="searchForm"
          :list="searchFormList"
        >
          <template #search>
            <my-button type="primary" @click="search()">搜索</my-button>
            <my-button @click="rest">重置</my-button>
          </template>
        </Myform>
      </div>
    </div>
    <Mytable
      border
      :isLoading="isLoading"
      :data="list"
      :column="column"
      :is-pagination="true"
      :pagination="pagination"
      @paginationChange="handleCurrentChange"
      @paginationSizeChange="handleSizeChange"
      @selection-change="selectionChange"
    >
      <template #index="{ data }">
        <span>{{ data.$index + 1 }}</span>
      </template>

      <template #operation="{ data }">
        <div class="operation">
          <my-button type="primary" size="small" @click="handleEdit(data.row)"
            >编辑</my-button
          >
          <my-button
            isDelete
            type="danger"
            size="small"
            @click="handleDel(data.row)"
            >删除</my-button
          >
        </div>
      </template>
    </Mytable>

    <el-dialog
      v-model="dialogVisible"
      :title="form.isEdit ? '编辑编码规则' : '新增编码规则'"
      width="50%"
      @closed="dialogClose"
    >
      <Myform
        ref="formRef"
        label-width="100px"
        :form="form"
        :list="formList"
      ></Myform>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button v-if="form.isEdit" type="primary" @click="update"
            >修改</el-button
          >
          <el-button v-else type="primary" @click="submit">新增</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, nextTick } from "vue";
import Mytable, { Colum, Pagination } from "@/components/table/index.vue";
import Myform, { CascaderItem, InputItem } from "@/components/Form/index.vue";
import Api from "./api/index";
import {
  GetIicindCodeRequest,
  GetIicindCodItem,
  AddIicindCodeRequest,
} from "./api/index.d";
//编辑表单数据
const updateFormList: (CascaderItem | InputItem)[] = [
  {
    name: "pid",
    type: "cascader",
    placeholder: "请选择父级(顶级不填)",
    label: "编码规则:",
    props: {
      lazy: true,
      label: "cnName",
      value: "rowId",
      checkStrictly: true,
      emitPath: false,
      lazyLoad(
        node: {
          value: any;
          children: any[];
          level: number;
          loaded: boolean;
          loading: boolean;
        },
        resolve: (arg0: GetIicindCodItem[]) => void
      ) {
        if (node.value === undefined) {
          node.value = "-1";
        }
        getIicindCodeListChildren({ pid: node.value }).then((res) => {
          if (!res.result.records || res.result.records.length === 0) {
            resolve(null);
          } else {
            resolve(res.result.records);
          }
        });
      },
    },
    options: [],
    col: {
      span: 24,
    },
  },
  {
    name: "code",
    type: "text",
    label: "编码:",
    placeholder: "请输入编码",

    col: {
      span: 24,
    },
  },
  {
    name: "cnName",
    type: "text",
    label: "中文名:",
    placeholder: "请输入中文名",
    rules: {
      required: true,
      message: "请输入中文名",
      trigger: "blur",
    },
    col: {
      span: 24,
    },
  },
  {
    name: "enName",
    type: "text",
    placeholder: "请输入英文名",
    label: "英文名:",

    rules: {
      required: true,
      message: "请输入英文名",
      trigger: "blur",
    },
    col: {
      span: 24,
    },
  },
];
//添加表单数据
const addFormList: (CascaderItem | InputItem)[] = [
  ...updateFormList,
  {
    name: "rowId",
    type: "text",
    placeholder: "请输入rowId(没有就不填)",
    label: "rowId:",
    col: {
      span: 24,
    },
  },
];

type stateProps = {
  column: Colum[];
  list: GetIicindCodItem[];
  pagination: Pagination;
  isLoading: boolean;
  ids: string[];
  dialogVisible: boolean;
  form: AddIicindCodeRequest & { isEdit?: boolean };
  formList: (CascaderItem | InputItem)[];
  searchForm: { code: string; cnName: string; enName: string };
  searchFormList: InputItem[];
};

const formRef = ref<InstanceType<typeof Myform>>();
const searchRef = ref<InstanceType<typeof Myform>>();
const state = reactive<stateProps>({
  searchForm: {
    code: null,
    cnName: null,
    enName: null,
  },
  searchFormList: [
    {
      name: "code",
      type: "text",
      label: "编码:",
      placeholder: "请输入编码",
      col: {
        span: 5,
      },
    },
    {
      name: "cnName",
      type: "text",
      label: "中文名:",
      placeholder: "请输入中文名",

      col: {
        span: 5,
      },
    },
    {
      name: "enName",
      type: "text",
      placeholder: "请输入英文名",
      label: "英文名:",
      col: {
        span: 5,
      },
    },
    {
      name: "search",
      type: "slot",
      labelWidth: "50px",
      col: {
        span: 5,
      },
    },
  ],
  form: { rowId: "", pid: "", code: "", cnName: "", enName: "", isEdit: false },
  formList: addFormList,
  dialogVisible: false,
  isLoading: false,
  ids: [], //多选删除
  list: [],
  pagination: {
    layout: "total, sizes, prev, pager, next, jumper",
    total: 0,
    currentPage: 1,
    pageSize: 10,
  },
  column: [
    {
      prop: "cnName1",
      label: "类别名称",
      minWidth: "100px",
    },
    {
      prop: "enName1",
      label: "类别英文名称",
      minWidth: "100px",
    },
    {
      prop: "code1",
      label: "类别代码",
      minWidth: "100px",
    },
    {
      prop: "cnName2",
      label: "类型名称",
      minWidth: "100px",
    },
    {
      prop: "enName2",
      label: "类型英文名称",
      minWidth: "100px",
    },
    {
      prop: "code2",
      label: "类型代码",
      minWidth: "100px",
    },
    {
      prop: "cnName3",
      label: "板块名称",
      minWidth: "100px",
    },
    {
      prop: "enName3",
      label: "板块英文名称",
      minWidth: "100px",
    },
    {
      prop: "code",
      label: "板块代码",
      minWidth: "100px",
    },
  ],
});

//编辑
const handleEdit = async (item: GetIicindCodItem) => {
  const info = await getIicindCodeInfo(item.rowId);
  if (info) {
    state.formList = updateFormList;
    state.form.rowId = info.rowId;
    state.form.code = info.code;
    state.form.cnName = info.cnName;
    state.form.enName = info.enName;
    state.form.pid = info.pid;
    state.dialogVisible = true;
    state.form.isEdit = true;
  }
};
// 删除 || 批量删除
const handleDel = async (item: GetIicindCodItem) => {
  // let data: string[] = [];
  // if (item) {
  //   data = [item.rowId];
  // } else {
  //   data = state.ids;
  // }
  const res = await Api.deleteIicindCode(item.rowId);
  if (res.code == 200) {
    Api.ElMessage.success(res.message);
    getIicindCodeList();
  } else {
    Api.ElMessage.error(res.message);
  }
};
//页数改变
const handleCurrentChange = () => {
  getIicindCodeList();
};
// 分页大小改变
const handleSizeChange = () => {
  getIicindCodeList();
};
//获取列表All
const getIicindCodeList = async () => {
  state.isLoading = true;
  const res = await Api.getIicindCodeListAll({
    limit: state.pagination.pageSize,
    page: state.pagination.currentPage,
    ...state.searchForm,
  });
  if (res.code == 200) {
    state.list = res.result.records;
    state.pagination.total = res.result.total;
  } else {
    Api.ElMessage.error(res.message);
  }
  state.isLoading = false;
};
// 获取子级
const getIicindCodeListChildren = async ({
  pid,
  level,
}: {
  pid?: string;
  level?: number;
}) => {
  return await Api.getIicindCodeList({
    limit: 10000,
    page: 1,
    pid,
    level,
  });
};
const getIicindCodeInfo = async (rowId: string) => {
  const res = await Api.getIicindCodeInfo(rowId);
  if (res.code == 200) {
    return res.result;
  } else {
    return null;
  }
};
//多选删除
const selectionChange = (list: GetIicindCodItem[]) => {
  state.ids = list.map((v) => v.rowId);
};
//新增
const showDialogVisible = () => {
  state.formList = addFormList;
  state.dialogVisible = true;
};
// 关闭弹窗事件
const dialogClose = () => {
  state.form = {
    pid: "",
    code: "",
    cnName: "",
    enName: "",
    rowId: "",
    isEdit: false,
  };
  state.dialogVisible = false;
  state.form.isEdit = false;
};
// 修改
const update = async () => {
  const data = { ...state.form };
  delete data.isEdit;
  const res = await Api.updateIicindCode(data);
  if (res.code == 200) {
    Api.ElMessage.success(res.message);
    state.dialogVisible = false;

    getIicindCodeList();
  } else {
    Api.ElMessage.error(res.message);
    state.dialogVisible = false;
  }
};

//新增
const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    const res = await Api.addIicindCode(state.form);
    if (res.code == 200) {
      Api.ElMessage.success(res.message);
      state.dialogVisible = false;
      getIicindCodeList();
    } else {
      Api.ElMessage.error(res.message);
      state.dialogVisible = false;
    }
  });
  console.log();
};
//搜索
const search = () => {
  state.pagination.currentPage = 1;
  getIicindCodeList();
};
//清空
const rest = () => {
  searchRef.value.resetForm();
};

getIicindCodeList();

const {
  searchFormList,
  searchForm,
  list,
  column,
  pagination,
  isLoading,
  dialogVisible,
  form,
  formList,
} = {
  ...toRefs(state),
};
</script>
<style scoped lang="scss">
.RuleCoding {
  padding: 20px;
  .add-con {
    padding-bottom: 20px;
  }
}
</style>
