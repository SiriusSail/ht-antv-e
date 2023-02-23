<template>
  <div class="MessageInfo">
    <div class="message-title">{{ helpInfo.title }}</div>
    <div class="list">
      <MessageItem
        v-for="item in detailList"
        :key="item.id"
        :message="item.messageContent"
        :avatar-name="item.replier"
        :avatar-img="item.createBy"
        :time="item.gmtCreate"
        :download="item.attachmentPath"
        :item="item"
      />
    </div>

    <MyForm
      ref="formRef"
      :form="form"
      :list="formList"
      label-position="right"
      label-width="auto"
      v-if="isDisable"
    >
      <template #messageContent>
        <LeaveMessage
          ref="leaveMessageRef"
          v-model="form.messageContent"
          label="回复留言"
          show-indicator
          @fileChange="fileChange"
          @assemblyClick="onAssemblyClick"
          @indexClick="onIndexClick"
        />
      </template>
    </MyForm>

    <div class="footer">
      <template v-if="isDisable">
        <el-button type="primary" @click="submit">回复留言</el-button>
        <el-popconfirm
          confirm-button-text="已解决"
          cancel-button-text="未解决"
          cancel-button-type="danger"
          icon-color="red"
          title="是否解决问题？"
          @confirm="confirm"
          @cancel="cancel"
        >
          <template #reference>
            <el-button type="primary">结束沟通</el-button>
          </template>
        </el-popconfirm>
      </template>
      <my-button @click="returnHome()">返回求助首页</my-button>
    </div>

    <el-dialog v-model="dialogVisible2" title="指标推荐" width="30%">
      <MyForm ref="form2Ref" :form="form" :list="dialog2FormList"> </MyForm>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible2 = false">
            确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import MessageItem from "./component/MessageItem.vue";
import LeaveMessage from "./component/LeaveMessage.vue";
import MyForm, { InputItem, SelectItem } from "@/components/Form/index.vue";
import Api, { GetMessageInfo } from "./api/index";
// import type { IicindflowPageRespone } from "./api/index.d";
type StateType = {
  formList: InputItem[];
  form: {
    componentIds: any;
    componentNames: any;
    helpId: string;
    messageContent: string;
    indicatorsIds: string;
    indicatorsNames: string;
    attachmentPath: string;
    domainCode: string;
  };
  dialogVisible1: boolean;
  dialogVisible2: boolean;
  dialogFormList: SelectItem[];
  dialog2FormList: SelectItem[];
  allSelect: { label: string; value: string }[];
} & GetMessageInfo;

export default defineComponent({
  components: {
    MessageItem,
    MyForm,
    LeaveMessage,
  },
  setup() {
    // const leaveMessageRef = <InstanceType<typeof LeaveMessage>>ref();
    const route = useRoute();
    const router = useRouter();
    const formRef = ref<InstanceType<typeof MyForm>>();
    const state = reactive<StateType>({
      dialogVisible1: false,
      dialogVisible2: false,
      form: {
        componentIds: [], // 逗号分隔
        componentNames: [], // 逗号分隔
        helpId: "",
        messageContent: "",
        indicatorsIds: "", // 逗号分隔
        indicatorsNames: "", // 逗号分隔
        attachmentPath: "",
        domainCode: "", //领域code
      },
      formList: [
        {
          label: "",
          name: "messageContent",
          labelWidth: "",
          type: "slot",
          rules: { required: true, message: "请输入回复内容", trigger: "blur" },
          col: {
            xs: {
              span: 24,
            },
            md: {
              span: 24,
            },
            lg: { span: 24 },
          },
        },
      ],
      helpInfo: {
        createBy: "",
        forHelpBy: "",
        forHelpById: "",
        forHelpDomain: "",
        forHelpType: "",
        gmtCreate: "",
        gmtModified: "",
        helpBy: "",
        id: 0,
        isDeleted: "",
        modifiedBy: "",
        rowId: "",
        status: "",
        title: "",
      },
      detailList: [],

      dialogFormList: [],

      dialog2FormList: [
        {
          type: "select",
          name: "domainCode",
          label: "指标领域分类",
          clearable: true,

          select: [
            {
              label: "",
              value: "",
            },
          ],
        },
        {
          type: "select",
          label: "指标",
          name: "componentIds",
          multiple: true,
          multipleLimit: 3,
          select: [
            {
              label: "",
              value: "",
            },
          ],
        },
      ],
      allSelect: [],
    });
    const isDisable = computed(() => {
      return (
        state.helpInfo.status !== "3" &&
        state.helpInfo.status !== "4" &&
        state.helpInfo.status !== "5" &&
        state.helpInfo.status !== ""
      );
    });
    const getInfo = async () => {
      const res = await Api.getMessageInfo(state.form.helpId);
      if (res.code == 200) {
        state.helpInfo = res.result.helpInfo;
        res.result.detailList.forEach((item: any) => {
          if (item.componentNames) {
            item.componentNames = item.componentNames.split(",");
          }
        });
        state.detailList = res.result.detailList;
      } else {
        Api.ElMessage.error(res.message);
      }
    };

    const confirm = async () => {
      updateStatus("4");
    };
    const cancel = async () => {
      updateStatus("3");
    };

    const updateStatus = async (status: string) => {
      const res = await Api.updateStatus({
        rowId: state.helpInfo.rowId,
        status,
      });
      if (res.code) {
        Api.ElMessage.success(res.message);
        setTimeout(() => {
          returnHome();
        }, 1000);
      } else {
        Api.ElMessage.error(res.message);
      }
    };

    if (!route.query.id) {
      Api.ElMessage.error("缺少必要参数");
      return;
    }
    state.form.helpId = route.query.id.toString();
    getInfo();

    const submit = () => {
      formRef.value?.validate(async (valid: any, aaa) => {
        if (valid) {
          const data = { ...state.form };
          delete data.domainCode;
          data.componentIds.forEach((element: string) => {
            const item = state.allSelect.find((v) => v.value === element);
            if (item) {
              data.componentNames.push(item.label);
            }
          });
          data.componentIds = data.componentIds.toString();
          data.componentNames = data.componentNames.toString();

          const res = await Api.iichelpdetail(data);
          if (res.code === 200) {
            Api.ElMessage.success(res.message);
            formRef.value?.resetForm();
            getInfo();
          } else {
            Api.ElMessage.error(res.message);
          }
        }
      });
    };
    //设置图片文件
    const fileChange = (path: string) => {
      state.form.attachmentPath = path;
    };
    const returnHome = () => {
      router.push("/myhelp");
    };

    const onAssemblyClick = () => {
      state.dialogVisible1 = true;
    };
    const onIndexClick = () => {
      state.dialogVisible2 = true;
    };
    // 获取指标
    const getIndexList = async () => {
      const res = await Api.iicindflowPage({
        limit: 10000,
        page: 1,
        domainCode: state.form.domainCode,
      });

      if (res.code == 200) {
        const selectItem = state.dialog2FormList.find(
          (v) => v.name === "componentIds"
        );
        selectItem.select = res.result.records.map((k) => {
          return {
            label: k.name,
            value: k.rowId,
          };
        });
        if (state.allSelect.length == 0) {
          state.allSelect = JSON.parse(JSON.stringify(selectItem.select));
        }
      }
    };
    //获取领域
    const getDomain = async () => {
      const res = await Api.getDomain();
      if (res.code == 200) {
        const selectItem = state.dialog2FormList.find(
          (v) => v.name === "domainCode"
        );
        selectItem.select = res.result.map((k) => {
          return {
            label: k.dictLabel,
            value: k.dictValue,
          };
        });
        selectItem.select.unshift({ label: "全部", value: "" });
      }
    };
    getDomain();
    getIndexList();
    watch(
      () => state.form.domainCode,
      () => {
        getIndexList();
      }
    );

    return {
      isDisable,
      onAssemblyClick,
      onIndexClick,
      returnHome,
      confirm,
      cancel,
      submit,
      fileChange,
      ...toRefs(state),
      formRef,
    };
  },
});
</script>
<style scoped lang="scss">
.MessageInfo {
  padding: 40px;
  padding-bottom: 60px;
  .message-title {
    font-size: 18px;
    font-weight: 550;
    // border-bottom: 1px solid #ccc;
    line-height: 22px;
  }
  .footer {
    padding-top: 20px;
    text-align: center;
  }
}
:deep(.el-popconfirm__main) {
  padding: 20px 0;
}
.pagination {
  padding-top: 10px;
  text-align: right;
}
</style>
