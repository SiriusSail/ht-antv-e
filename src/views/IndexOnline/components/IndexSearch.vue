<template>
  <div class="IndexSearch">
    <MyForm
      ref="formRef"
      :form="query"
      status-icon
      :list="list"
      label-position="right"
      label-width="auto"
      key="formRef"
    >
      <template #searchsubmit>
        <div class="searchsubmit">
          <el-button @click="search" type="primary">查询</el-button>
          <el-button type="primary" @click="download">下载</el-button>
        </div>
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
} from "@/components/Form/index.vue";
import Api from "../api/index";
import { DownloadBlob } from "@/utils/func";

type StateType = {
  list: (
    | InputItem
    | RadioGroupItem
    | SelectItem
    | CheckboxGroupItem
    | CheckboxItem
  )[];
};

export default defineComponent({
  components: {
    MyForm,
  },
  props: {
    query: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const formRef = ref<InstanceType<typeof MyForm>>();

    // 指标固化表单
    const state = reactive<StateType>({
      list: [
        {
          name: "domainCode",
          type: "select",
          label: "领域",
          placeholder: "请选择领域",
          labelWidth: "55px",
          col: {
            span: 6,
          },
          select: [],
        },
        {
          name: "flowType",
          type: "select",
          label: "类型",
          placeholder: "请选择指标类型",
          col: {
            offset: 1,
            span: 6,
          },
          select: [],
        },
        {
          label: "指标名称",
          name: "name",
          labelWidth: "80px",
          type: "text",
          col: {
            span: 7,
            offset: 1,
          },
        },
        {
          label: "指标编码",
          placeholder: "请输入指标编码",
          name: "code",
          labelWidth: "80px",
          type: "text",
          col: {
            span: 6,
          },
        },
        {
          label: "指标维度",
          placeholder: "请输入指标维度",
          name: "flowAttr",
          labelWidth: "100px",
          type: "text",
          col: {
            span: 7,
          },
        },
        {
          name: "searchsubmit",
          type: "slot",
          col: {
            span: 6,
            offset: 1,
          },
        },
      ],
    });

    const submit = () => {
      formRef.value?.validate((valid: any) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
        }
      });
    };
    const reset = () => {
      console.log(formRef.value);
      formRef.value?.resetForm();
    };

    const search = () => {
      emit("search");
    };
    const getDomain = async () => {
      const res = await Api.getDomain();
      if (res.code == 200) {
        const item = <SelectItem>state.list.find((v) => v.name == "domainCode");
        if (item) {
          const select: { label: string; value: string }[] = [];
          select.push({
            value: "",
            label: "全部",
          });
          res.result.forEach((v) => {
            select.push({ label: v.dictLabel, value: v.dictValue });
          });
          item.select = select;
        }
      } else {
        Api.ElMessage.error(res.message);
      }
    };

    const getFlowType = async () => {
      const res = await Api.getFlowType();
      if (res.code == 200) {
        const item = <SelectItem>state.list.find((v) => v.name == "flowType");
        if (item) {
          const select: { label: string; value: string }[] = [];
          select.push({
            value: "",
            label: "全部",
          });
          res.result.forEach((v) => {
            select.push({ label: v.dictLabel, value: v.dictValue });
          });
          item.select = select;
        }
      } else {
        Api.ElMessage.error(res.message);
      }
    };

    const download = () => {
      Api.export(props.query).then((res) => {
        DownloadBlob(
          res.data,
          res.headers["content-type"],
          decodeURIComponent(
            res.headers["content-disposition"]
              .split(";")[1]
              .split("filename=")[1]
          )
        );
      });
      // console.log(
      //   "/ddm-iic/indFlow/iicindflow/export?" + getUrlParamsStr(props.query)
      // );
      // location.href =
      //   "/ddm-iic/indFlow/iicindflow/export?" + getUrlParamsStr(props.query);
    };

    getDomain();
    getFlowType();
    return {
      search,
      submit,
      reset,
      formRef,
      ...toRefs(state),
      download,
    };
  },
});
</script>
<style scoped lang="scss">
:deep(.el-form-item__label) {
  font-size: 14px;
}
.searchsubmit {
  span {
    cursor: pointer;
  }
  font-size: 16px;
  color: #20a0ff;
  padding-left: 10px;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  text-decoration: underline;
}
</style>
