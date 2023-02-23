import { defineComponent, onMounted, computed } from "vue";
// import { RouterView } from 'vue-router'
import zhLocale from "element-plus/lib/locale/lang/zh-cn";
import enLocale from "element-plus/lib/locale/lang/en";
import { ElConfigProvider } from "element-plus/lib/components/config-provider";
import RouterView from "@/router/routerView.vue";
import 'dayjs/locale/zh-cn'

export default defineComponent({
  setup() {
    // methods
    // 改变tableHeight的大小
    // const resizeHeight = () => {
    //   const { clientHeight } = document.body; // 获取文档可视区域的宽度
    //   const height = Math.max(600, clientHeight - 170); // 保证最小值大于600
    //   store.commit("settingsModule/setTableHeight", height); // 设置tableHeight
    // };
    // resizeHeight()
    return () => (
      <ElConfigProvider locale={zhLocale}>
        <div id='ElConfigProvider'>
          <RouterView />
        </div>
      </ElConfigProvider>
    );
  },
});
