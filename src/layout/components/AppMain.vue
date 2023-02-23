<template>
  <section class="app-main">
    <app-title></app-title>
    <div class="app-content">
      <div
        class="message-con"
        :class="{ bottom: list.length > 0 && isElNotification }"
      >
        <div class="el-notification__title">消息提示</div>
        <div
          class="el-icon el-notification__closeBtn"
          @click="isElNotification = false"
        >
          <em class="el-icon-close"></em>
        </div>
        <div class="message-list">
          <el-scrollbar>
            <p
              class="item"
              v-for="(item, index) in list"
              @click="goMessageInfo(item, index)"
              :key="item.row_id"
            >
              <span>{{ item.message_content }}</span>
            </p>
          </el-scrollbar>
        </div>
      </div>
      <router-view v-if="$route.meta.keepAlive" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>

      <router-view v-if="!$route.meta.keepAlive" v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </div>
  </section>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from "vue";
import { useRouter } from "vue-router";
import { getMyMessagesApi, deleteSysmessageApi } from "./api/index";
import type { GetData } from "./api/index.d";
import AppTitle from "./AppTitle/index";

import appMainStore from "./store";
export default defineComponent({
  name: "AppMain",
  components: {
    AppTitle,
  },
  setup() {
    const router = useRouter();
    const store = appMainStore();
    const list = ref<GetData[]>([]);

    const getMyMessages = async () => {
      const res = await getMyMessagesApi();
      if (res.code == 200) {
        list.value = res.result;
        store.isElNotification = true;
      }
    };
    const goMessageInfo = async (item: GetData, index: number) => {
      deleteSysmessageApi([item.row_id]);
      list.value.splice(index, 1);
      store.isElNotification = false;
      router.push({ path: "/messageInfo", query: { id: item.message_id } });
      // /ddm-iic/sys/sysmessage
    };

    onMounted(() => {
      if (store.isElNotification) {
        store.isElNotification = true;
      }
    });
    if (!store.isElNotification) {
      getMyMessages();
    }
    const { isElNotification } = toRefs(store);

    return {
      goMessageInfo,
      list,
      isElNotification,
    };
  },
});
</script>
<style scoped lang="scss">
.app-main {
  height: 100vh;
  width: 100%;
  position: relative;
  /* overflow: hidden; */
  background-color: white;
  display: flex;
  flex-direction: column;
}

.app-content {
  height: calc(100vh - 78px);
  flex: 1;
  position: relative;
  overflow: auto;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
.message-con {
  position: fixed;
  width: 300px;
  bottom: -240px;
  right: 20px;
  padding: 14px 13px 14px 13px;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid #ebeef5;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s, transform 0.3s, left 0.3s, right 0.3s, top 0.4s,
    bottom 0.3s;
  overflow-wrap: anywhere;
  overflow: hidden;
  z-index: 999;
  .message-list {
    padding-top: 10px;
    color: #606266;
    .item {
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      cursor: pointer;
      margin-top: 5px;
    }
    :deep(.el-scrollbar) {
      .el-scrollbar__wrap {
        max-height: 180px; // 最大高度
      }
    }
  }
}
.bottom {
  bottom: 16px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
