import { defineStore } from "pinia";
import { reactive } from "vue";

export default defineStore("demandManage", {
  state: () => {
    const state = reactive({
      createRequire: false, //创建需求弹窗
      createsChedule: false,
    });
    return state;
  },
});
