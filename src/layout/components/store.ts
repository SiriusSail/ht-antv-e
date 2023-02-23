import { defineStore } from "pinia";
import { reactive } from "vue";

export default defineStore("appMain", {
  state: () => {
    const state = reactive({
      isElNotification: false,
    });
    return state;
  },
});
