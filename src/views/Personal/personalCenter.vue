<template>
  <div class="page-container">
    <div class="account-avatar">
      <img alt=''
           src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
      <div class="account-coment">
        <div>登录账号：{{ userInfo.loginName }}</div>
        <div>账号ID：{{ userInfo.loginId }}</div>
        <div class="account-coment_bottom">
          <span>部门：{{ userInfo.departmentName }}</span>

        </div>
      </div>
    </div>
    <div class="drop_col">
      <div class="drop_col__user">
        <em class="el-icon-user"></em>
        <span>我的画像</span>
      </div>
      <el-button type="primary"
                 @click="handleEditLabel()">修改</el-button>
    </div>
    <div class="col_label">
      <div v-for="item in labelList"
           class="item">
        <el-tag> {{ item }}</el-tag>
      </div>
    </div>
    <div class="drop_col">
      <div class="drop_col__user">
        <em class="el-icon-user"></em>
        <span>我的贡献值</span>
      </div>

    </div>
    <div class="contribute">
      <div class="contribute_item">
        <div>贡献值</div>
        <div>{{myPoints.summaryPoints}}</div>
      </div>
      <div class="contribute_item">
        <div>开发赋能</div>
        <div>{{myPoints.devPoints}}</div>
      </div>
      <div class="contribute_item">
        <div>知识赋能</div>
        <div>{{myPoints.knowledgePoints}}</div>
      </div>
      <div class="contribute_item">
        <div>推荐赋能</div>
        <div>{{myPoints.recommendationPoints}}</div>
      </div>
    </div>

    <div class="drop_col">
      <div class="drop_col__user">
        <em class="el-icon-user"></em>
        <span>成长值</span>
      </div>
    </div>
    敬请期待...

    <el-dialog v-model="add_visible"
               title="编辑"
               @closed="handleClose">
      <MyForm ref="formRef"
              :form="queryData"
              status-icon
              :list="fromData"
              label-position="right"
              label-width="auto">
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
  import { defineComponent, reactive, toRefs, onMounted, ref } from "vue";
  import { ElMessage } from "element-plus/lib/components/message";
  import Service from "./api/index";
  import MyForm from "@/components/Form/index.vue";

  interface stateType {
    userInfo: {};
    myPoints: {};
    labelList: any[];
    fromData: any[];
    add_visible: boolean;
    queryData: {
      userLabel: any[];
    };
  }

  export default defineComponent({
    name: "PersonalCenter",
    components: { MyForm },
    setup () {
      const formRef = ref<any>(null);
      const state = reactive<stateType>({
        add_visible: false,
        userInfo: {},
        myPoints: {},
        labelList: [],
        queryData: { userLabel: [] },
        fromData: [
          {
            type: "checkboxGroup",
            name: "userLabel",
            labelWidth: "0px",
            select: [],
          },

          { name: "submit", type: "slot", labelWidth: "0px" },
        ],
      });
      /**
       * @description 获取角色
       */
      const getUserInfo = async () => {
        // store.state.userModule.user.id
        const res = await Service.postSetBasicInfo();
        state.userInfo = res.result;
        state.labelList = res.result.userLabels.split(",");
      };
      /**
       * @description 获取全部标签
       */
      const getLabelList = async () => {
        // store.state.userModule.user.id
        const res = await Service.labelList();
        state.fromData[0].select = [];
        res.result.map((item: any) => {
          const obj: any = { label: "", value: "" };
          obj.label = `${item}`;
          obj.value = `${item}`;
          state.fromData[0].select.push(obj);
        });
      };
      /**
       * @description 获取全部标签
       */
      const getMyPoints = async () => {
        const res = await Service.myPoints();
        state.myPoints = res.result
      };
      /** select
       * @description 编辑
       */
      const handleEditLabel = () => {
        state.queryData.userLabel = state.labelList;
        state.add_visible = true;
      };

      // 保存数据
      const handleSubmit = () => {
        formRef.value?.validate(async (valid: any) => {
          if (valid) {
            const sData: any = state.queryData;
            sData.userLabel = state.queryData.userLabel.join(",");
            const res = await Service.editLabel(sData);
            if (res.success)
              ElMessage.success({
                message: "操作成功",
                type: "success",
              });
            state.add_visible = false;
            getUserInfo();
          }
        });
      };

      onMounted(() => {
        getUserInfo();
        getLabelList();
        getMyPoints();
      });
      return {
        handleEditLabel,
        handleSubmit,
        formRef,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="scss" scoped>
  .page-container {
    padding: 20px;

    .account-avatar {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      img {
        width: 105px;
        height: 105px;
        border-radius: 50%;
      }

      .account-coment {
        width: 100%;
        margin-left: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
        line-height: 28px;

        .account-coment_bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .col_label {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .item {
        margin-left: 10px;
        margin-top: 10px;
      }
    }

    .drop_col {
      width: 100%;
      padding: 10px 20px;
      background: #f8f8f8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 50px;
    }

    .contribute {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #c0ccda;
      border-bottom: 1px solid #c0ccda;
      border-right: 1px solid #c0ccda;

      .contribute_item {
        width: 25%;
        padding: 35px 0;
        line-height: 30px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-left: 1px solid #c0ccda;
      }
    }
    .operation {
      width: 100%;
      text-align: center;
    }
  }
</style>
