<template>
  <div class="upload-file-box">
    <div class="upload-file-head">
      <div class="tab">附件</div>
      <div class="tab input-line">
        <label for="fileId">
          <div class="upload-btn icon-btn">
            <span>+添加</span>
          </div>
        </label>
        <input id="fileId" type="file" class="files" @change="changeFiles" />
      </div>
    </div>

    <div class="upload-file-con">
      <div class="item" v-for="item in fileList" :key="item.uid">
        <div class="input-line">
          <div class="input-info">
            <img class="fileTypeImg" src alt='' />
            <span>文件名称{{ item.name }}</span>
          </div>
          <div class="percent-con" v-if="item.state == 'load'">
            <div class="loading-box">
              <div
                class="current-loading"
                :style="{ width: item.percent + '%' }"
              ></div>
            </div>
            <div class="percent-val">{{ Math.round(item.percent) }}%</div>
          </div>
        </div>
        <div class="operation">
          <em class="icon el-icon-download" v-if="item.state == 'success'"></em>
          <em class="icon el-icon-view" v-if="item.state == 'success'"></em>
          <div>
            <em class="icon el-icon-warning" v-if="item.state == 'fail'"></em>
            <span class="again-btn">重新上传</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";

type FileItem = {
  uid: number;
  file: File;
  url: string;
  state: "load" | "success" | "fail";
  percent: number;
  name: string;
};

type sateType = {
  fileList: FileItem[];
  uid: number;
};
export default defineComponent({
  setup() {
    const state = reactive<sateType>({
      fileList: [],
      uid: 0,
    });

    const changeFiles = (e: Event) => {
      const fileId = <HTMLInputElement>document.getElementById("fileId");
      const { files } = fileId;
      if (files && files.length) {
        for (let i = 0; i < files.length; i++) {
          state.uid++;
          const file = files[i];
          const fileItem: FileItem = {
            uid: state.uid,
            file,
            url: "",
            state: "load",
            percent: 0,
            name: file.name,
          };
          state.fileList.push(fileItem);
          //上传文件 通过uid来改变状态
        }
        //清空选择
        fileId.value = "";
      }
    };
    return {
      changeFiles,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.upload-file-box {
  border-radius: 8px;
  border: 1px solid #c0ccda;
  padding: 18px;
  .fileTypeImg {
    width: 22px;
    height: 26px;
  }
  .files {
    display: none;
  }
  .upload-file-head {
    display: flex;
    .tab {
      margin-right: 20px;
    }
  }
  .upload-file-con {
    padding-top: 20px;
  }
  .input-line {
    flex: 1;
    .input-info {
      width: 100%;
      overflow: hidden;
      font-size: 13px;
    }

    .input {
      float: left;
      width: 400px;
      margin-left: 16px;
    }

    .icon-btn {
      cursor: pointer;
    }

    .upload-btn {
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }

    .ban-button {
      cursor: not-allowed;
      background-color: #eeeff3;
    }

    .loading-box {
      margin-top: 10px;
      margin-left: 25px;

      width: 80%;
      height: 10px;
      background-color: #f6f6f6;
      border-radius: 5px;

      .current-loading {
        height: 10px;
        border-radius: 5px;
        background-color: #3399cc;
        /*width: 50%;*/
      }
    }
    .percent-con {
      display: flex;
    }
    .percent-val {
      line-height: 30px;
      width: 60px;
      text-align: center;
      font-size: 14px;
      color: #666;
      float: left;
    }

    .cancel-btn {
      line-height: 40px;
      font-size: 14px;
      color: #999;
      text-decoration: underline;
      cursor: pointer;
      user-select: none;

      &:hover {
        color: #3399cc;
      }
    }
  }
  .item {
    display: flex;
    align-items: center;

    border-bottom: 1px solid #ccc;
    padding: 10px;

    .operation {
      font-size: 13px;
      color: #666;
      flex: 1;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 6px;
        color: #5c6876;
      }
      .el-icon-warning {
        color: #fe6666;
      }
      .again-btn {
        cursor: pointer;
      }
    }
  }
}
</style>
