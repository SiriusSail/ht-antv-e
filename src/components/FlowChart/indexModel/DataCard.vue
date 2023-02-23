<template>
  <el-tooltip
    content="若指标为运行状态， 点击可查看指标卡片或"
    placement="bottom"
    effect="light"
  >
    <div class="DataCrd">
      <em class="icon" :class="icon"></em>
      <div class="text">{{ name }}</div>
    </div>
  </el-tooltip>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import * as Element from "element-plus";
const { ElTooltip } = Element;

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: "el-icon-folder-opened",
    },
    name: {
      type: String,
      default: "数据卡片",
    },
  },
  components: { ElTooltip },
  setup() {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.DataCrd {
  text-align: center;
  width: 65px;
  height: 65px;
  background: #cdeaff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 14px;
  color: #333;
}
</style>
