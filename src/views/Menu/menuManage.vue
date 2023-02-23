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
               :is-loading="isLoading"
               empty-text="暂无数据"
               :pagination="pagination"
               @paginationChange="handleCurrentChange"
               @paginationSizeChange="handleSizeChange">
        <template #icon="{ data }">
          <iconfont :name="data.row.icon"></iconfont>
        </template>
        <template #isVisible="{ data }">
          <span>{{ data.row.isVisible == 1 ? "否" : "是" }}</span>
        </template>
        <template #menuType="{ data }">
          <span v-if="data.row.menuType == 'M'">目录</span>
          <span v-if="data.row.menuType == 'C'">菜单</span>
          <span v-if="data.row.menuType == 'F'">按钮</span>
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
        <template #icon="{ data }">
          <el-input v-model="queryData[data.name]"
                    :disabled="data.disabled"
                    :placeholder="data.placeholder">
          </el-input>
          <em :class="queryData[data.name]"></em>
          <el-popover :visible="modal"
                      placement="left"
                      width="50vw"
                      title="请选择图标">
            <icons @success="onSuccess"></icons>
            <template #reference>
              <el-button type="primary"
                         @click="handleClickChoose">选择图标</el-button>
            </template>
          </el-popover>
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
  import MyForm from "@/components/Form/index.vue";
  import { useConfirmDelete } from "@/utils/func";
  import { ElMessage } from "element-plus/lib/components/message";
  import Icons from "@/components/icon.vue";
  import Iconfont, { iconfontNameArr } from "@/components/Iconfont";
  import { positiveInteger } from "@/utils/validate";
  import Service from "./api/index";

  type StateType = {
    sId: any;
    queryData: {
      roleName: string;
      roleCode: string;
      isEnable: string;
      remark: string;
      icon: string;
      isVisible: number;
      routePath: string;
      componentCode: string,
      redirect: string,
      menuCode: string,
    };
    querySearchData: {
      orderField: string;
      order: string;
      menuName: string;
    };
    fromSearchData: any[];
    fromData: any[];
    tableData: any[];
    tableColumn: Colum[];
    add_visible: boolean;
    isBtnLoading: boolean;
    editType: string;
    modal: boolean;
  };

  export default defineComponent({
    components: {
      MyTable,
      MyForm,
      Icons,
      Iconfont,
    },

    setup () {
      /** **************************************** 初始化数据 ************************************************* */

      const formRef = ref<any>(null);
      const state = reactive<StateType>({
        sId: "",
        modal: false,
        querySearchData: {
          orderField: "gmt_create",
          order: "desc",
          menuName: "",
        },
        fromSearchData: [
          {
            type: "text",
            label: "菜单名称：",
            name: "menuName",
            placeholder: "请输入流程名称",
            labelWidth: "90px",
            col: { span: 5 },
          },
          { name: "submit", type: "slot", labelWidth: "10px", col: { span: 1 } },
        ],

        queryData: {
          roleName: "",
          roleCode: "",
          isEnable: "0",
          remark: "",
          icon: "",
          isVisible: 0,
          routePath: "",
          componentCode: "",
          redirect: "",
          menuCode: "",
        },

        fromData: [
          {
            type: "select", label: "父级选择：", name: "parentId", placeholder: "请选择",
            col: { span: 12 }, select: []
          },
          {
            type: "text", label: "路由重定向：", name: "redirect", placeholder: "请输入路由地址", labelWidth: "100px",
            col: { span: 12 }
          },
          {
            type: "text", label: "中文名称：", name: "menuName", placeholder: "请输入菜单名称", labelWidth: "100px", col: { span: 12 },
            rules: { required: true, message: "请输入角色名称", trigger: "blur" }
          },
          {
            type: "text", label: "英文名称：", name: "menuCode", placeholder: "请输入菜单名称", labelWidth: "100px", col: { span: 12 },
            rules: { required: true, message: "请输入角色名称", trigger: "blur" }
          },
          {
            type: "text", label: "路径名称：", name: "componentCode", placeholder: "请输入路径名称", labelWidth: "100px",
            col: { span: 12 },
            rules: {
              required: true,
              message: "请输入角色名称",
              trigger: "blur",
            },
          },
          {
            type: "text", label: "组件路径：", name: "componentPath", placeholder: "请输入组件路径", labelWidth: "100px",
            col: { span: 12 },
            rules: {
              required: true,
              message: "请输入角色名称",
              trigger: "blur",
            },
          },
          {
            type: "text", label: "路由地址：", name: "routePath", placeholder: "请输入路由地址", labelWidth: "100px",
            col: { span: 12 },
            rules: {
              required: true,
              message: "请输入路由地址",
              trigger: "blur",
            },
          },

          {
            type: "text", label: "显示顺序：", name: "orderNum", placeholder: "请输入顺序号", labelWidth: "100px",
            col: { span: 12 },
            rules: [{ required: true, trigger: "blur", validator: positiveInteger }],
          },
          {
            type: "select", label: "菜单类型：", name: "menuType", placeholder: "请选择", labelWidth: "100px",
            col: { span: 12 },
            select: [
              { value: "M", label: "目录" },
              { value: "C", label: "菜单" },
              { value: "F", label: "按钮" },
            ],
            rules: { required: true, message: "请选择", trigger: "blur" },
          },

          {
            type: "select", label: "是否显示：", name: "isVisible", placeholder: "请选择", labelWidth: "100px",
            col: { span: 12 },
            select: [
              { value: 0, label: "是" },
              { value: 1, label: "否" },
            ],
            rules: { required: true, message: "请输入英文名称", trigger: "blur" },
          },
          {
            type: "slot", label: "图标：", name: "icon", placeholder: "请选择图标", disabled: true,
            col: { span: 12 },
            rules: { required: true, message: "请选择图标", trigger: "blur" },
          },
          {
            type: "textarea", label: "备注：", name: "remark", placeholder: "写个备注记录下呗",
          },
          { name: "submit", type: "slot", labelWidth: "0px" },
        ],
        tableColumn: [
          {
            label: "菜单名称", prop: "menuName", minWidth: "80px", showOverflowTooltip: true,
          },
          {
            label: "菜单类型", prop: "menuType", minWidth: "80px", showOverflowTooltip: true, slot: true,
          },
          {
            label: "显示顺序",
            prop: "orderNum",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "路由地址",
            prop: "routePath",
            minWidth: "80px",
            showOverflowTooltip: true,
          },
          {
            label: "组件路径",
            prop: "componentPath",
            minWidth: "100px",
            showOverflowTooltip: true,
          },
          {
            label: "菜单图标",
            prop: "icon",
            minWidth: "80px",
            showOverflowTooltip: true,
            slot: true,
          },

          {
            label: "是否显示",
            prop: "isVisible",
            minWidth: "80px",
            showOverflowTooltip: true,
            slot: true,
          },
          {
            label: "更新时间",
            prop: "gmtModified",
            minWidth: "150px",
            showOverflowTooltip: true
            , sortable: true
          },
          {
            label: "创建时间",
            prop: "gmtCreate",
            minWidth: "150px",
            showOverflowTooltip: true
            , sortable: true
          },
          { label: "备注", prop: "remark" },
          {
            label: "操作",
            prop: "operation",
            width: "160px",
            slot: true,
            fixed: "right",
          },
        ],
        tableData: [],
        add_visible: false,
        isBtnLoading: false,
        editType: "save",
      });
      /** **************************************** vue生命周期 ************************************************* */
      onMounted(() => {
        getList();

      });

      /** **************************************** 自定义click事件 ************************************************* */
      const handleClickChoose = () => {
        state.modal = !state.modal;
      };
      const onSuccess = (val: string) => {
        state.queryData.icon = val;
        state.modal = false;
      };
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
        const bData: any = JSON.parse(JSON.stringify(state.querySearchData));
        comState.pagination = { ...comState.pagination, ...bData };
        getList();
      };

      // 编辑
      const handleEdit = (item: any) => {
        state.editType = "edit";
        const objItem = JSON.parse(JSON.stringify(item));
        state.queryData = objItem;
        state.sId = objItem.rowId;
        onCreate();
      };

      // 删除
      const handleDel = async (item: any) => {
        const resul = await useConfirmDelete("是否删除该菜单?");
        if (resul) {
          const res = await Service.multifunction("delete", [item.rowId]);
          if (res.success) {
            ElMessage.success({
              message: '删除成功',
              type: 'success',
            })
            getList()
          } else {
            ElMessage.success({
              message: '删除失败',
              type: 'success',
            })
          }
        }
      };
      // 新增弹出
      const onCreate = () => {
        state.add_visible = true;
        getTreeList();
      };

      // 关闭弹出层时清空表单数据
      const handleClose = () => {
        state.modal = false;
        state.queryData = {
          roleName: "",
          roleCode: "",
          isEnable: "",
          remark: "",
          icon: "",
          isVisible: 0,
          routePath: "",
          componentCode: "",
          redirect: "",
          menuCode: "",
        };
        formRef.value?.resetForm(state.queryData);
      };

      // 保存数据
      const handleSubmit = () => {
        formRef.value?.validate(async (valid: any) => {
          if (valid) {
            let meothod = "post";
            const sData: any = state.queryData;
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

      /** **************************************** 自定义方法 ************************************************* */

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
      // 获取弹出层类型数据
      const getTreeList = async () => {
        const res = await Service.getTree()
        state.fromData[0].select = []
        res.result.map((item: any) => {
          state.fromData[0].select.push({ label: item.menuName, value: item.rowId })
        })
      }
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
        onSuccess,
        handleClickChoose,
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
