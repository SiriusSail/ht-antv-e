<template>
  <div class="addHelp">
    <el-row :gutter="20">
      <el-col :span="18">
        <MyForm
          ref="formRef"
          :form="form"
          :list="formList"
          label-position="right"
          labelWidth="90px"
        >
          <template #messageContent>
            <leave-message
              @fileChange="fileChange"
              v-model="form.messageContent"
              label="发起求助"
            >
            </leave-message>
          </template>
        </MyForm>
        <div class="footer">
          <my-button type="primary" v-if="!rowId" @click="submit()"
            >发起求助</my-button
          >
          <my-button type="primary" v-else @click="updateHelp()"
            >修改</my-button
          >
          <my-button @click="returnHome()">返回求助首页</my-button>
        </div>
      </el-col>
      <el-col :span="6">
        <HotList :list="hotList" @item-click="setHelpUser" />
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch } from "vue";
import HotList from "./component/hot-list.vue";
import LeaveMessage from "./component/LeaveMessage.vue";
import MyForm, { InputItem, SelectItem } from "@/components/Form/index.vue";
import Api, { Recommendation } from "./api/index";
import { useRoute, useRouter } from "vue-router";

type StateType = {
  formList: (InputItem | SelectItem)[];
  form: {
    id: number;
    helpBy: string;
    title: string;
    forHelpDomain: string;
    forHelpType: string;
    attachmentPath: string;
    messageContent: string;
    status: string;
    helpById: string | number;
  };
  rowId: string; //修改ID
  hotList: any[];
};

export default defineComponent({
  components: { MyForm, LeaveMessage, HotList },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const state = <StateType>reactive({
      rowId: "",
      form: {
        helpBy: "", // 帮助人
        helpById: "", // 帮助人
        title: "", //标题
        forHelpDomain: "", //领域
        forHelpType: "", //类型
        attachmentPath: "", //附件
        messageContent: "", //内容
        status: "1", //状态 默认
      },
      formList: [
        {
          label: "求助标题",
          name: "title",
          type: "text",
          placeholder: "请输入求助标题",
          rules: {
            required: true,
            message: "请输入求助标题",
            trigger: "blur",
          },
          col: {
            xs: {
              span: 24,
            },
            md: {
              span: 12,
            },
            lg: { span: 12 },
          },
        },
        {
          label: "帮助人",
          name: "helpBy",
          type: "text",
          disabled: true,
          placeholder: "请在智积推荐选择帮助人",
          rules: {
            required: true,
            message: "请在智积推荐选择帮助人",
            trigger: "blur",
          },
          col: {
            xs: {
              span: 24,
            },
            md: {
              span: 12,
            },
            lg: { span: 12 },
          },
        },
        {
          label: "求助类型",
          placeholder: "请选择求助类型",
          name: "forHelpType",
          type: "select",
          col: {
            xs: {
              span: 24,
            },
            md: {
              span: 12,
            },
            lg: { span: 12 },
          },
          rules: { required: true, message: "请选择求助类型", trigger: "blur" },
          select: [],
        },
        {
          label: "求助领域",
          placeholder: "请输入求助领域",
          name: "forHelpDomain",
          type: "select",
          rules: { required: true, message: "请选择求助领域", trigger: "blur" },
          select: [],
          col: {
            xs: {
              span: 24,
            },
            md: {
              span: 12,
            },
            lg: { span: 12 },
          },
        },
        {
          label: "",
          name: "messageContent",
          labelWidth: "0px",
          type: "slot",
          rules: { required: true, message: "请输入回复内容", trigger: "blur" },
          col: {
            span: 24,
          },
        },
      ],
      hotList: [],
    });
    const formRef = ref<InstanceType<typeof MyForm>>();
    let select: { label: string; value: string }[] = []; //存储领域
    //监听 选择改变就请求数据
    watch(
      () => [state.form.forHelpType, state.form.forHelpDomain],
      ([newforHelpType, newforHelpDomain]) => {
        if (newforHelpType && newforHelpDomain) {
          recommendationList();
        }
      }
    );
    //上传
    const submit = () => {
      formRef.value?.validate(async (valid) => {
        if (valid) {
          const data = {
            ...state.form,
            helpDetailDTO: {
              attachmentPath: state.form.attachmentPath, //附件
              messageContent: state.form.messageContent, //内容
            },
          };
          delete data.attachmentPath; //删除对象属性
          delete data.messageContent; //删除对象属性
          const res = await Api.addHelp(data);
          if (res.code === 200) {
            Api.ElMessage.success(res.message);
            setTimeout(() => {
              router.push("/myhelp");
            }, 1500);
          } else {
            Api.ElMessage.error(res.message);
          }
        }
      });
    };

    //提交修改
    const updateHelp = () => {
      formRef.value?.validate(async (valid) => {
        if (valid) {
          const data = {
            ...state.form,
            helpDetailDTO: {
              attachmentPath: state.form.attachmentPath, //附件
              messageContent: state.form.messageContent, //内容
            },
            rowId: state.rowId,
          };
          const res = await Api.updateHelp(data);
          if (res.code === 200) {
            Api.ElMessage.success(res.message);
            setTimeout(() => {
              router.push("/myhelp");
            }, 1500);
          } else {
            Api.ElMessage.error(res.message);
          }
        }
      });
    };
    const returnHome = () => {
      router.push("/myhelp");
    };

    //暂存
    const storage = async () => {
      formRef.value?.eleForm?.validateField("title", async (valid) => {
        if (valid) {
          return false;
        }
        const data = {
          id: state.form.id,
          helpBy: state.form.helpBy,
          helpById: state.form.helpById,
          title: state.form.title,
          forHelpDomain: state.form.forHelpDomain,
          forHelpType: state.form.forHelpType,
          status: "0",
          helpDetailDTO: {
            attachmentPath: state.form.attachmentPath, //附件
            messageContent: state.form.messageContent, //内容
          },
        };
        const res = await Api.addHelp(data);
        if (res.code === 200) {
          Api.ElMessage.success(res.message);
          setTimeout(() => {
            router.push("/myhelp");
          }, 1500);
        } else {
          Api.ElMessage.error(res.message);
        }
      });
    };

    const reset = () => {
      formRef.value?.resetForm();
    };
    // 获取领域
    const getDomain = async () => {
      const res = await Api.getDomain();
      if (res.code == 200) {
        const item = <SelectItem>(
          state.formList.find((v) => v.name == "forHelpDomain")
        );
        if (item) {
          res.result.forEach((v) => {
            select.push({ label: v.dictLabel, value: v.dictValue });
          });
          item.select = select;
        }
      } else {
        Api.ElMessage.error(res.message);
      }
    };
    //获取类型
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

    // 获取详情
    const getInfo = async () => {
      const res = await Api.getMessageInfo(state.rowId);
      if (res.code == 200) {
        console.log(res.result);
        const helpInfo = res.result.helpInfo;
        const detailList = res.result.detailList;
        state.form.messageContent = detailList[0].messageContent;
        state.form.title = helpInfo.title;
        state.form.forHelpDomain = helpInfo.forHelpDomain;
        state.form.forHelpType = helpInfo.forHelpType;
        state.form.helpBy = helpInfo.helpBy;

        // state.helpInfo = res.result.helpInfo;
        // state.detailList = res.result.detailList;
      } else {
        Api.ElMessage.error(res.message);
      }
    };
    //获取智能推荐
    const recommendationList = async () => {
      const res = await Api.recommendationList({
        area: state.form.forHelpDomain,
        type: state.form.forHelpType,
      });
      if (res.code == 200) {
        state.hotList = res.result;
      } else {
        state.hotList = [];
        Api.ElMessage.error(res.message);
      }
    };
    //设置帮助人
    const setHelpUser = (item: Recommendation) => {
      state.form.helpBy = item.userCode;
      state.form.helpById = item.rowId;
    };

    //设置图片文件
    const fileChange = (path: string) => {
      state.form.attachmentPath = path;
    };

    if (route.query.id) {
      state.rowId = route.query.id.toString();
      getInfo();
    }

    if (route.query.forHelpType || route.query.forHelpDomain) {
      state.form.forHelpType = route.query.forHelpType.toString();
      state.form.forHelpDomain = route.query.forHelpDomain.toString();
      recommendationList();
    }

    //初始化
    const created = async () => {
      getForHelpType();
      getDomain();
    };

    created();
    return {
      formRef,
      ...toRefs(state),
      setHelpUser,
      storage,
      submit,
      updateHelp,
      returnHome,
      fileChange,
      reset,
    };
  },
});
</script>
<style scoped lang="scss">
.addHelp {
  padding: 30px;
}
.footer {
  text-align: center;
}
</style>
