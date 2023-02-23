<template>
  <el-form ref="eleForm" class="demand_rorm" :model="detailData" :rules="rules">
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="isLoading"
      :span-method="arraySpanMethod"
    >
      <el-table-column align="center" headerAlign="center">
        <template #header>
          <el-form-item prop="demandName" size="mini">
            <el-input
              class="input_title"
              size="mini"
              v-model="detailData.demandName"
              :disabled="detailData.reviewState == 100 || isShow ? true : false"
              placeholder="需求名称：安全率指标需求"
            />
          </el-form-item>
          <el-form-item prop="demandField" size="mini">
            <el-input
              class="input_title"
              size="mini"
              v-model="detailData.demandField"
              :disabled="detailData.reviewState == 100 || isShow ? true : false"
              placeholder="请输入领域"
            />
          </el-form-item>
        </template>
        <el-table-column
          prop="serialNumber"
          label="序号"
          width="70px"
          align="center"
          headerAlign="center"
        >
          <template #default="scope">
            <span>{{ scope.row.serialNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkContent"
          label="检查内容"
          :show-overflow-tooltip="true"
          width="100px"
          align="left"
          headerAlign="center"
          :filters="filters"
          :filter-method="filterMethod"
          filter-placement="bottom-start"
          column-key="checkContent"
          :filter-multiple="false"
        >
          <template #default="scope">
            <span v-if="scope.row.checkContent.includes('*')" class="red"
              >*</span
            >
            <span v-if="scope.row.checkContent.includes('*')">{{
              scope.row.checkContent.slice(1)
            }}</span>

            <span v-else>{{ scope.row.checkContent }} </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkExplain"
          label="检查说明"
          :show-overflow-tooltip="true"
          width="100px"
          align="center"
          headerAlign="center"
        >
          <template #default="scope">
            <span>{{ scope.row.checkExplain }}</span>
          </template>
        </el-table-column>
        <el-table-column label="自查信息" align="center" headerAlign="center">
          <el-table-column
            prop="selfCheckContent"
            label="自查结论"
            align="center"
            headerAlign="center"
          >
            <template #default="scope">
              <!-- {{}} -->
              <div v-if="scope.row.checkType">
                <el-input
                  type="textarea"
                  v-model="scope.row.selfCheckContent"
                  :disabled="
                    detailData.reviewState == 100 || isShow ? true : false
                  "
                  placeholder="申请人填写内容"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="fileUrl"
            width="100px"
            align="center"
            headerAlign="center"
            show-overflow-tooltip
          >
            <template #header>
              <el-tooltip content="举证材料" placement="top">
                <div class="long_title">
                  <span>举证材料</span>
                </div>
              </el-tooltip>
            </template>
            <template #default="scope">
              <div v-if="scope.row.checkType">
                <template v-if="scope.row.fileUrl">
                  <el-button
                    size="mini"
                    type="primary"
                    @click="handleFileDownload(scope.row)"
                    >下载</el-button
                  >
                </template>
                <template v-if="detailData.reviewState != 100">
                  <el-upload
                    style="margin-top: 10px"
                    ref="refUpload"
                    class="upload-demo"
                    :action="urls"
                    :headers="{
                      'cas-token': getToken(),
                    }"
                    multiple
                    :on-success="
                    (data:any, file:any, filelsit:any) =>
                      onSuccess(data, file, filelsit, scope.row)
                  "
                    :on-error="
                    (data:any, file:any, filelsit:any) =>
                      onError(data, file, filelsit, scope.row)
                  "
                    :file-list="scope.row.fileList"
                  >
                    <el-button size="mini" type="primary">上传</el-button>
                  </el-upload>
                </template>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="selfCheckDomain"
            width="80px"
            label="所属领域"
            align="center"
            headerAlign="center"
          >
            <template #default="scope">
              <span>{{ scope.row.selfCheckDomain }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <template v-if="type === 'edit'">
          <el-table-column
            prop="rectificatExplain"
            fixed="right"
            label="整改事项描述"
            align="center"
            headerAlign="center"
          >
            <template #default="scope">
              <el-input
                type="textarea"
                v-model="scope.row.rectificatExplain"
                :disabled="
                  detailData.reviewState == 100 || !isShow ? true : false
                "
                placeholder="审核人填写内容"
                @input="(data :any) => inputChange(data, scope.row)"
              />
            </template>
          </el-table-column>
        </template>
      </el-table-column>
    </el-table>
    <div class="demand_fotter" v-if="detailData.reviewState != 3">
      <el-button
        size="small"
        type="primary"
        :disabled="detailData.reviewState == 100 ? true : false"
        @click="handleSubmit"
        >保存</el-button
      >
    </div>
  </el-form>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { ElMessage } from "element-plus/lib/components/message";
import { debounces, dwonloadFile } from "@/utils/func";
import { ElForm } from "element-plus";
import Service from "../api/index";
import { DownloadBlob } from "@/utils/func";
export default defineComponent({
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["eventSubmit", "reightData"],
  setup(props, { emit }) {
    const eleForm = ref<InstanceType<typeof ElForm>>();
    const { isLoading } = toRefs(props);
    const refUpload = ref(null);
    const state = reactive({
      detailData: {
        reviewState: <any>"",
        demandName: <any>"",
        demandField: <any>"",
      },
      reightData: [],
      fileList: [],
      isShow: false,
      type: "save",
      filters: [{ text: "必填", value: "必填" }],
      rules: {
        demandName: [
          { required: true, message: "请输入需求名称", trigger: "blur" },
        ],
        demandField: [
          { required: true, message: "请输入领域", trigger: "blur" },
        ],
      },
      tableData: [],
      urls: `/ddm-iic/file/attachmentUpload`,
    });
    const getToken = () => {
      return sessionStorage.getItem("token");
    };
    // 提交
    const handleSubmit = async () => {
      eleForm.value.validate((valid) => {
        console.log(state);
        if (valid) {
          // 处理必填项是否全部已填
          let isExp: boolean = true;
          for (let index = 0; index < state.tableData.length; index++) {
            let must: any = "";
            let selfCheckContent: any = "";
            let rectificatExplain: any = "";
            const items = state.tableData[index];
            if (items.hasOwnProperty("isMust")) {
              must = items["isMust"];
            }
            if (items.hasOwnProperty("selfCheckContent")) {
              selfCheckContent = items["selfCheckContent"];
            }
            if (items.hasOwnProperty("rectificatExplain")) {
              rectificatExplain = items["rectificatExplain"];
            }
            if (must === "必填" && state.type === "save" && !selfCheckContent) {
              isExp = false;
              break;
            }
            if (
              must === "必填" &&
              state.type === "edit" &&
              !selfCheckContent &&
              !rectificatExplain
            ) {
              isExp = false;
              break;
            }
          }
          // 删除不需要的项
          let allData = state.tableData.filter((items) => {
            return (
              items.serialNumber !== "1" &&
              items.serialNumber !== "2" &&
              items.serialNumber !== "3" &&
              items.serialNumber !== "4" &&
              items.serialNumber !== "5" &&
              items.serialNumber !== "6"
            );
          });
          state.tableData = allData;
          if (isExp) {
            emit("eventSubmit", { ...state });
          } else {
            ElMessage({
              message: "请完善所有必填项,可在检查内容那一列有个三角筛选必填！",
              type: "warning",
              duration: 5000,
              customClass: "msgZindex",
            });
          }
        } else {
          ElMessage({
            message: "请完善所有必填项,可在检查内容那一列有个三角筛选必填！",
            type: "warning",
            duration: 5000,
            customClass: "msgZindex",
          });
        }
      });
    };
    // 接收修改的数据
    const update = (data: any, detailData?: any, type?: string) => {
      let list1 = [{ checkContent: "基本要求", serialNumber: "1" }];
      let list2 = [{ checkContent: "完整性要求", serialNumber: "2" }];
      let list3 = [{ checkContent: "准确性要求", serialNumber: "3" }];
      let list4 = [{ checkContent: "一致性要求", serialNumber: "4" }];
      let list5 = [{ checkContent: "安全性要求", serialNumber: "5" }];
      let list6 = [{ checkContent: "指标运营要求", serialNumber: "6" }];
      for (let index = 0; index < data.length; index++) {
        data[index]["fileList"] = [];
        if (data[index].isMust === "必填") {
          data[index].checkContent = "*" + data[index].checkContent;
        }

        if (data[index].checkType === "1") {
          list1.push(data[index]);
        }
        if (data[index].checkType === "2") {
          list2.push(data[index]);
        }
        if (data[index].checkType === "3") {
          list3.push(data[index]);
        }
        if (data[index].checkType === "4") {
          list4.push(data[index]);
        }
        if (data[index].checkType === "5") {
          list5.push(data[index]);
        }
        if (data[index].checkType === "6") {
          list6.push(data[index]);
        }
      }
      state.tableData = [
        ...list1,
        ...list2,
        ...list3,
        ...list4,
        ...list5,
        ...list6,
      ];
      if (detailData) {
        getUserInfo(detailData); //获取用户信息判断是否有修改权限
      }
      if (detailData) {
        state.detailData.demandName = "";
        state.detailData.demandField = "";
        state.detailData = detailData;
      }
      if (type) state.type = type;
    };
    const getUserInfo = async (detailData: any) => {
      const res = await Service.postSetBasicInfo();
      if (res.rowId === detailData.rowId) {
        state.isShow = true;
      }

      if (detailData.demandState != "1" || detailData.parentId) {
        state.detailData.reviewState = 100;
      }
    };
    // 筛选必填项列
    const filterMethod = (value: any, row: any) => {
      return row["isMust"] === value;
    };
    // 上传成功操作
    const onSuccess = (data: any, file: any, filelsit: any, row: any) => {
      if (data.code == 500) {
        ElMessage({
          message: "上传失败",
          type: "warning",
          customClass: "msgZindex",
        });
        row.fileList = [];
        return;
      }
      row["fileUrl"] = data.result;
      ElMessage({
        message: "上传成功",
        type: "success",
        customClass: "msgZindex",
      });
    };
    // 上传失败操作
    const onError = (data: any, file: any, filelsit: any, row: any) => {
      row.fileList = [];
      ElMessage({
        message: "上传失败",
        type: "warning",
        customClass: "msgZindex",
      });
    };
    // 下载举证材料
    const handleFileDownload = async (row: any) => {
      Service.attachmentDownload(row.fileUrl).then((res) => {
        console.log("进入");
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
      // dwonloadFile(1, `${row.fileUrl}`);
    };

    const arraySpanMethod = (row: any) => {
      if (row.row.serialNumber === "1") {
        if (row.columnIndex === 0) {
          return [1, 1];
        } else if (row.columnIndex === 1) {
          return [1, 8];
        }
      }
      if (row.row.serialNumber === "2") {
        if (row.columnIndex === 0) {
          return [1, 1];
        } else if (row.columnIndex === 1) {
          return [1, 8];
        }
      }
      if (row.row.serialNumber === "3") {
        if (row.columnIndex === 0) {
          return [1, 1];
        } else if (row.columnIndex === 1) {
          return [1, 8];
        }
      }
      if (row.row.serialNumber === "4") {
        if (row.columnIndex === 0) {
          return [1, 1];
        } else if (row.columnIndex === 1) {
          return [1, 8];
        }
      }
      if (row.row.serialNumber === "5") {
        if (row.columnIndex === 0) {
          return [1, 1];
        } else if (row.columnIndex === 1) {
          return [1, 8];
        }
      }
      if (row.row.serialNumber === "6") {
        if (row.columnIndex === 0) {
          return [1, 1];
        } else if (row.columnIndex === 1) {
          return [1, 8];
        }
      }
      // if (row.rowIndex === 0) {
      //   return [1, 8]
      // }
    };

    // 整改事项描述实时印射到右边显示
    const inputChange = debounces((data: any, row: any) => {
      const ret = state.reightData.findIndex((v) => {
        return v.id == row.id;
      });
      if (ret === -1) {
        state.reightData = [...state.reightData, row];
      }
      emit("reightData", state.reightData);
    }, 500);

    return {
      handleSubmit,
      getToken,
      filterMethod,
      arraySpanMethod,
      update,
      onSuccess,
      onError,
      refUpload,
      handleFileDownload,
      inputChange,
      isLoading,
      eleForm,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.demand_rorm {
  .input_title {
    font-size: 18px;
    font-weight: 600;
  }
  .demand_fotter {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }

  .long_title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .red {
    color: red;
  }
}
</style>
<style lang="scss">
.el-popper {
  max-width: 40%;
}
</style>
