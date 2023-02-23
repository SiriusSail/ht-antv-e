<template>
  <div class="LeaveMessage">
    <h1 class="label">{{ label }}</h1>

    <div class="message-con">
      <div class="commonlyUsed">
        <div v-if="showComponent" class="commonly-item">
          <span class="pointer" @click="$emit('assemblyClick')">组件推荐</span>
        </div>
        <div v-if="showIndicator" class="commonly-item">
          <span class="pointer" @click="$emit('indexClick')">指标推荐</span>
        </div>

        <div class="commonly-item">
          <div v-if="fileUpload === '1'" class="onload">
            上传中 <em class="el-icon-loading"></em>
          </div>
          <div v-else-if="fileUpload === '2'" class="onload">
            <span class="upload_success">上传成功</span>
            <span class="restupload" @click="fileclick">重新上传</span>
          </div>
          <div v-else-if="fileUpload === '3'" class="onload">
            <span class="upload_error">上传失败</span>
            <span class="restupload" @click="fileclick">重新上传</span>
          </div>
          <span class="pointer" v-else @click="fileclick">附件上传</span>
          <input
            type="file"
            class="file"
            @change="changeFiles"
            id="messageFile"
          />
        </div>
      </div>
      <el-input
        :model-value="modelValue"
        type="textarea"
        placeholder="请输入留言信息"
        rows="10"
        :autosize="{ minRows: 10, maxRows: 10 }"
        resize="none"
        v-bind="$attrs"
        @input="updateValue"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import Api from "../api/index";

export default defineComponent({
  props: {
    modelValue: {
      // 双向绑定值
      type: String,
      default: "",
    },

    label: {
      // 输入框标题
      type: String,
      default: "留言",
    },
    showComponent: {
      // 是否显示组件推荐
      type: Boolean,
      default: false,
    },
    showIndicator: {
      // 是否显示指标推荐
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { modelValue } = toRefs(props);
    const state = reactive({
      fileUpload: "0",
      fileUrl: "", // 上传回来的文件
    });
    const updateValue = (str: string) => {
      emit("update:modelValue", str); // 传递的方法
    };
    const changeFiles = async (e: Event) => {
      const fileId = <HTMLInputElement>document.getElementById("messageFile");
      const { files } = fileId;
      state.fileUpload = "1";
      if (files && files.length) {
        const file = files[0];
        const formData = new FormData();
        formData.append("file", file);
        const res = await Api.attachmentUpload(formData);
        if (res.code == 200) {
          state.fileUpload = "2";
          state.fileUrl = res.result;
          emit("fileChange", state.fileUrl);
        } else {
          state.fileUpload = "3";
          state.fileUrl = "";
        }
        fileId.value = "";
      }
    };
    const fileclick = () => {
      const fileId = <HTMLInputElement>document.getElementById("messageFile");
      fileId.click();
    };
    const restForm = () => {
      state.fileUrl = "";
      state.fileUpload = "0";
      modelValue.value = "";
    };

    return {
      fileclick,
      updateValue,
      changeFiles,
      restForm,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.LeaveMessage {
  width: 100%;

  .label {
    font-weight: 550;
    font-size: 18px;
    color: #333;
  }
  .message-con {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .commonlyUsed {
    display: flex;
    padding-bottom: 10px;
    .commonly-item {
      color: #2082ff;
      font-size: 14px;
      margin-right: 20px;
    }
    .file {
      display: none;
    }
    .message-footer {
      padding-top: 20px;
    }
    .disable {
      color: #ccc;
    }

    .upload_success {
      color: #529b2e;
    }
    .upload_error {
      color: #f23c3c;
    }
    .restupload {
      cursor: pointer;
      margin-left: 20px;
    }

    .pointer {
      cursor: pointer;
    }
  }
}
</style>
