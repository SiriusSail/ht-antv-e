<!-- 基于element按钮封装一层 -->
<template>
  <el-button v-bind="$attrs" @click="onClick">
    <slot></slot>
  </el-button>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import { debounce } from "@/utils/func";
import * as Element from "element-plus";
const { ElMessageBox } = Element;
export default defineComponent({
  props: {
    isDelete: {
      type: Boolean,
      default: false,
    },
    delay: {
      type: Number,
      default: 300,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const { delay } = toRefs(props);
    const state = reactive({});
    // 防抖按钮
    const onClick = debounce(() => {
      if (props.isDelete) {
        ElMessageBox.confirm("确认删除吗?", "删除警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          emit("click");
        });
        return;
      }
      emit("click");
    }, delay.value);
    return {
      onClick,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss"></style>
