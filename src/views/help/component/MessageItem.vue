<template>
  <div class="MessageItem">
    <div class="usserInfo">
      <div class="avatar-border">
        <el-avatar
          shape="square"
          :size="88"
          :src="defaultAvatarImg"
        ></el-avatar>
      </div>
      <p class="avatar_name">{{ avatarName }}</p>
    </div>
    <div class="massage-con">
      <div class="message-text">
        {{ message }}
      </div>
      <div class="message-tail">
        <div class="assemblyList">
          <div
            class="assembly-item"
            v-for="v in item.componentNames"
            @click="href(v)"
          >
            {{ v }}
          </div>
        </div>
        <div class="tail-right">
          <div
            v-if="download"
            class="tail-item download"
            @click="downloadUrl(download)"
          >
            附件下载 <span>{{ getFileName(download) }}</span>
          </div>
          <div class="tail-item time">留言时间：{{ time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, nextTick } from "vue";
import * as Element from "element-plus";
import { getFileName, DownloadBlob } from "@/utils/func";
import Api from "../api/index";
import { useRouter } from "vue-router";
import defaultAvatarImg from "@/assets/images/avather-404.png";
const { ElMessage } = Element;
export default defineComponent({
  props: {
    // 留言
    message: {
      type: String,
      default: "",
    },
    // 昵称
    avatarName: {
      type: String,
      default: "",
    },
    // 用户头像
    avatarImg: {
      type: String,
      default: "",
    },
    // 留言时间
    time: { type: String, default: "" },
    // 下载路径
    download: {
      type: String,
      default: "",
    },
    item: {
      type: Object,
      default: {},
    },
  },
  setup() {
    const router = useRouter();
    const state = reactive({});
    const downloadUrl = async (url: string) => {
      Api.attachmentDownload(url).then((res) => {
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
    };
    const href = (str: string) => {
      router.push({ path: "/indexOnline/index", query: { key: str } });
    };
    return {
      href,
      downloadUrl,
      ...toRefs(state),
      getFileName,
      defaultAvatarImg,
    };
  },
});
</script>
<style scoped lang="scss">
.MessageItem {
  display: flex;
  margin-top: 16px;
  border: 1px solid #e5e5e5;

  .usserInfo {
    width: 180px;
    padding: 24px 20px 7px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(250, 251, 252);
  }
  .avatar-border {
    padding: 3px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
    .el-avatar {
      display: block;
    }
  }
  .avatar_name {
    color: #2d64b3;
    line-height: 40px;
  }
  .massage-con {
    overflow: hidden;
    flex: 1;
  }
  .message-text {
    padding: 24px 20px 7px 20px;
    word-wrap: break-word;
    white-space: pre-line;
    min-height: 170px;
    font-size: 16px;
    // text-align: justify;
  }
  .message-tail {
    padding: 4px 20px 7px 20px;

    font-size: 14px;
    line-height: 32px;

    .assemblyList {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      padding: 10px 10px;
      .assembly-item {
        margin-right: 10px;
        background-color: #409eff;
        color: #fff;
        padding: 0px 8px;
        border-radius: 6px;
        font-size: 12px;
        line-height: 26px;
        margin-top: 4px;
      }
    }
    .tail-right {
      border-top: 1px solid #e5e5e5;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      font-size: 12px;
      white-space: nowrap;
    }
    // justify-content: flex-end;
    color: #409eff;

    .tail-item {
      margin-left: 20px;
    }
    .time {
      color: #999;
    }
    .download {
      cursor: pointer;
    }
  }
}
</style>
