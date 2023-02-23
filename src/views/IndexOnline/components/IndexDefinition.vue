<template>
  <div class="IndexDefinition">
    <MyForm
      ref="form2Ref"
      :form="form"
      :list="formList"
      label-position="right"
      label-width="200px"
      :readonly="true"
    >
      <!--  -->
      <template #monthRight>
        <span style="padding-left: 8px">月</span>
      </template>
      <!--  -->
      <template #cronRight>
        <div class="cronTip"><span>测试</span> <span>帮助</span></div>
      </template>
      <template #retryRight>
        <div class="retryTip">（任务执行失败后，进行重试的设置）</div>
      </template>
    </MyForm>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import MyForm, {
  InputItem,
  RadioGroupItem,
  SelectItem,
  CheckboxGroupItem,
  CheckboxItem,
  TimeSelectItem,
} from "@/components/Form/index.vue";

import Api, { Definition } from "../api/index";

type IndexSolidificationStateType = {
  formList: (
    | InputItem
    | RadioGroupItem
    | SelectItem
    | CheckboxGroupItem
    | CheckboxItem
    | TimeSelectItem
  )[];
  form: Definition;
};

export default defineComponent({
  components: {
    MyForm,
  },

  setup() {
    const form2Ref = ref<InstanceType<typeof MyForm>>();

    // 指标固化表单
    const state = reactive<IndexSolidificationStateType>({
      form: {
        analyticalMethod: "",
        analyticalType: "",
        code: "",
        dataEngineer: "",
        dataFrom: "",
        dataManager: "",
        defContent: "",
        depart: "",
        domain: "",
        fetchType: "",
        formula: "",
        gradation: [],
        id: null,
        name: "",
        onlineStage: "",
        owner: "",
        rowId: "",
        scriptStr: "",
        topic: "",
        warnRule: "",
      },
      formList: [
        {
          name: "name",
          type: "text",
          label: "指标名称",
          placeholder: "暂无内容",

          col: {
            md: { span: 12 },
          },
        },
        {
          name: "code",
          type: "text",
          label: "指标编码",

          col: {
            md: { span: 12 },
          },
        },
        {
          name: "topic",
          type: "text",
          label: "分析主题",

          placeholder: "暂无内容",
          col: {
            md: { span: 12 },
          },
        },
        {
          name: "domain",
          label: "分析领域",
          placeholder: "暂无内容",

          type: "text",
          col: {
            md: { span: 12 },
          },
        },
        {
          name: "defContent",
          label: "指标定义",

          type: "textarea",
          placeholder: "暂无内容",
          col: {
            span: 24,
          },
        },
        {
          label: "业务负责部门",
          name: "depart",

          placeholder: "暂无内容",
          type: "text",
          col: {
            md: { span: 12 },
          },
        },
        {
          label: "数据拥有者",
          placeholder: "暂无内容",

          name: "owner",
          type: "text",

          col: {
            md: { span: 12 },
          },
        },
        {
          name: "dataEngineer",
          type: "text",
          label: "数据工程师",

          placeholder: "暂无内容",
          col: {
            md: { span: 12 },
          },
        },
        {
          name: "onlineStage",
          type: "text",
          label: "上线阶段",

          placeholder: "暂无内容",
          col: {
            md: { span: 12 },
          },
        },
        {
          name: "dataManager",
          type: "text",
          label: "业务领域数据管家",
          placeholder: "暂无内容",

          col: {
            md: { span: 12 },
          },
        },
        {
          label: "数据频率",
          name: "fetchType",

          type: "radioGroup",
          col: {
            span: 24,
          },
          select: [
            {
              label: "实时",
              value: "1",
            },
            {
              label: "日",
              value: "2",
            },
            {
              label: "月",
              value: "3",
            },
            {
              label: "年",
              value: "4",
            },
            {
              label: "周",
              value: "5",
            },
          ],
        },
        {
          label: "指标层次",
          name: "gradation",
          type: "checkboxGroup",
          col: {
            span: 24,
          },
          select: [
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
          ],
        },
        {
          name: "formula",
          label: "计算公式或者业务逻辑",
          placeholder: "暂无内容",
          type: "textarea",
          col: {
            span: 24,
          },
        },
        {
          label: "业务负责部门",
          name: "depart",
          placeholder: "暂无内容",
          type: "number",
          col: {
            span: 12,
          },
        },
        {
          label: "分析方法",
          name: "analyticalMethod",
          type: "text",

          col: {
            span: 24,
          },
        },
        {
          label: "取数频率",
          name: "fetchType",
          type: "radioGroup",
          col: {
            span: 24,
          },
          select: [
            {
              label: "实时",
              value: "1",
            },
            {
              label: "日",
              value: "2",
            },
            {
              label: "月",
              value: "3",
            },
            {
              label: "年",
              value: "4",
            },
            {
              label: "周",
              value: "5",
            },
          ],
        },
        {
          name: "dataFrom",
          label: "数据来源",
          placeholder: "暂无内容",
          type: "textarea",
          col: {
            span: 24,
          },
        },
        {
          name: "scriptStr",
          label: "参考脚本",
          placeholder: "暂无内容",
          type: "textarea",

          col: {
            span: 24,
          },
        },
      ],
    });

    const submit = () => {
      form2Ref.value?.validate((valid: any) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
        }
      });
    };
    const reset = () => {
      form2Ref.value?.resetForm();
    };

    const request = async (rowId: string) => {
      const res = await Api.getDefinition(rowId);
      if (res.code == 200) {
        if (res.result) {
          if (res.result.gradation) {
            const gradation = <any>res.result.gradation;
            res.result.gradation = gradation.split(",");
          } else {
            res.result.gradation = [];
          }
          state.form = res.result;
        }
      } else {
        Api.ElMessage.error(res.message);
        reset();
      }
    };

    return {
      request,
      submit,
      reset,
      form2Ref,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.IndexDefinition {
  position: relative;
  //
}
.cronTip {
  display: flex;
  white-space: nowrap;
  span {
    margin-left: 10px;
    color: #20a0ff;
    text-decoration: underline;
    font-size: 12px;
  }
}
.retryTip {
  color: #aaaaaa;
  font-size: 12px;
  white-space: nowrap;
}
.footer {
  text-align: center;
}
</style>
