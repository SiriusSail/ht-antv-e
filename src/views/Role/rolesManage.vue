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
      <div class="col_btn">
        <el-button type="primary"
                   icon="el-icon-plus"
                   size="small"
                   @click="onCreate">新增</el-button>
        <el-button type="success"
                   icon="el-icon-refresh"
                   size="small"
                   :loading="isBtnLoading"
                   @click="onRefresh">刷新</el-button>
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
        <template #isEnable="{ data }">
          <span>{{ data.row.isEnable == 1 ? "否" : "是" }}</span>
        </template>
        <template #operation="{ data }">
          <div class="operation">
            <el-button type="primary"
                       size="mini"
                       @click="handleEdit(data.row)">编辑</el-button>
            <el-button type="info"
                       size="mini"
                       @click="handleDel(data.row)">删除</el-button>
          </div>
        </template>
      </MyTable>
    </div>

    <el-dialog v-model="add_visible"
               :title="editType === 'save' ? '新增' : '编辑'"
               @closed="handleClose">
      <MyForm ref="formRef"
              :form="queryData"
              status-icon
              :list="fromData"
              label-position="right"
              label-width="auto">
        <template #menuIds="{ data }">
          <el-transfer :titles="['全部菜单', '已授权菜单']"
                       v-model="queryData[data.name]"
                       :props="{ key: 'rowId', label: 'menuName' }"
                       :data="menuList">
          </el-transfer>
        </template>
        <template #submit>
          <div class="operation">
            <el-button type="primary"
                       size="small"
                       @click="handleSubmit">保存</el-button>
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
    provide,
  } from "vue";
  import hwTableMixins from "@/mixins/hwTableMixins";
  import MyTable, { Colum } from "@/components/table/index.vue";
  import Service from "./api/index";
  import MyForm from "@/components/Form/index.vue";
  import { useConfirmDelete } from "@/utils/func";
  import { ElMessage } from "element-plus/lib/components/message";

  type StateType = {
    sId: any;
    queryData: {
      roleName: string;
      roleCode: string;
      isEnable: number;
      remark: string;
      menuIds: any[];
    };
    querySearchData: {
      orderField: string;
      order: string;
      roleName: string;
    };
    fromSearchData: any[];
    fromData: any[];
    tableData: any[];
    menuList: any[];
    tableColumn: Colum[];
    add_visible: Boolean;
    isBtnLoading: Boolean;
    editType: string;
  };

  export default defineComponent({
    components: {
      MyTable,
      MyForm,
    },

    setup () {
      /****************************************** 初始化数据 **************************************************/

      const formRef = ref<any>(null);
      const state = reactive<StateType>({
        sId: "",
        querySearchData: {
          orderField: "gmt_create",
          order: "desc",
          roleName: "",
        },
        fromSearchData: [
          {
            type: "text",
            label: "角色名称：",
            name: "roleName",
            placeholder: "请输入流程名称",
            labelWidth: "90px",
            col: { span: 5 },
          },
          { name: "submit", type: "slot", labelWidth: "10px", col: { span: 1 } },
        ],

        queryData: {
          roleName: "",
          roleCode: "",
          isEnable: 0,
          remark: "",
          menuIds: [],
        },

        fromData: [
          {
            type: "text",
            label: "角色名称",
            name: "roleName",
            placeholder: "请输入角色名称",
            labelWidth: "90px",
            col: { span: 12 },
            rules: { required: true, message: "请输入角色名称", trigger: "blur" },
          },
          {
            type: "text",
            label: "英文名称",
            name: "roleCode",
            placeholder: "请输入英文名称",
            labelWidth: "90px",
            col: { span: 12 },
            rules: { required: true, message: "请输入英文名称", trigger: "blur" },
          },
          {
            type: "radioGroup",
            label: "是否可用",
            name: "isEnable",
            placeholder: "请选择",
            select: [
              { value: 0, label: "是" },
              { value: 1, label: "否" },
            ],
          },
          {
            type: "textarea",
            label: "备注",
            name: "remark",
            placeholder: "写个备注记录下呗",
          },
          { type: "slot", name: "menuIds", labelWidth: "0px" },
          { name: "submit", type: "slot", labelWidth: "0px" },
        ],
        tableColumn: [
          {
            label: "角色名称",
            prop: "roleName",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "英文名称",
            prop: "roleCode",
            minWidth: "100px",
            showOverflowTooltip: true,
          },
          {
            label: "是否可用",
            prop: "isEnable",
            minWidth: "80px",
            showOverflowTooltip: true,
            slot: true,
          },
          {
            label: "更新时间",
            prop: "gmtModified",
            minWidth: "120px",
            showOverflowTooltip: true,
            sortable: true,
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            minWidth: "120px",
            showOverflowTooltip: true,
            sortable: true,
          },
          { label: "备注", prop: "remark", minWidth: "120px" },
          {
            label: "操作",
            prop: "operation",
            width: "160px",
            slot: true,
            fixed: "right",
          },
        ],
        tableData: [],
        menuList: [],
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

      // tabble查询
      const handleSerach = () => {
        let bData: any = JSON.parse(JSON.stringify(state.querySearchData));
        comState.pagination = { ...comState.pagination, ...bData };
        getList();
      };

      // 编辑
      const handleEdit = async (item: any) => {
        state.editType = 'edit'
        const objItem = JSON.parse(JSON.stringify(item))
        const res = await Service.menuDetail(objItem.rowId)
        objItem.menuIds = res.result.menuIds
        state.queryData = objItem
        state.sId = objItem.rowId
        onCreate()
      }

      // 删除
      const handleDel = async (item: any) => {
        const resul = await useConfirmDelete("是否删除该角色?");
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
        getMenuTreeList();
        state.add_visible = true;
      };

      // 关闭弹出层时清空表单数据
      const handleClose = () => {
        state.queryData = {
          roleName: "",
          roleCode: "",
          isEnable: 0,
          remark: "",
          menuIds: [],
        };
        formRef.value?.resetForm(state.queryData);
      };

      //保存数据
      const handleSubmit = () => {
        formRef.value?.validate(async (valid: any) => {
          if (valid) {
            let meothod = "post";
            let sData: any = state.queryData;
            if (state.editType === "edit") {
              meothod = "put";
              sData.rowId = state.sId;
            } else {
            }
            const res = await Service.multifunction(meothod, sData);
            if (res.success)
              ElMessage.success({
                message: "操作成功",
                type: "success",
              });
            state.add_visible = false;
            state.editType = "save";
            getList();
          }
        });
      };

      /****************************************** 自定义方法 **************************************************/
      // 获取弹出层类型数据
      const getMenuTreeList = async () => {
        const res = await Service.getMenuTreeList()
        state.menuList = []
        res.result.map((item) => {
          state.menuList.push(item)
          if (item['children']) {
            item['children'].map((it) => {
              state.menuList.push(it)
            })
          }
        })
        // state.menuList = res.result
      }

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
        handleEdit,
        handleDel,
        handleSerach,
        onCreate,
        onRefresh,
        formRef,
        handleSubmit,
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
