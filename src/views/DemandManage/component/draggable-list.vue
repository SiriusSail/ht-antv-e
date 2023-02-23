<template>
  <!-- 封装组件 -->
  <div class="draggable_list">
    <div class="draggabel_header">
      <div class="text_con">
        <span class="label">{{ label }}</span>
        <span class="num">({{ num }})</span>
      </div>
      <div class="draggabel_manipulate">
        <el-button
          class="draggabel_right_btn"
          type="info"
          plain
          :disabled="pages.page == 1 ? true : false"
          @click="handlePre(types)"
        >
          <em class="el-icon-arrow-left" />
        </el-button>
        <span style="color: #666666">{{ pages.page }}</span>
        <el-button
          class="draggabel_right_btn"
          type="info"
          plain
          :disabled="
            pages.page == pages.pages || pages.pages == 1 || pages.pages == 0
              ? true
              : false
          "
          @click="handleNext(types)"
        >
          <em class="el-icon-arrow-right" />
        </el-button>
      </div>
    </div>
    <div class="draggabel_body">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, nextTick } from "vue";

export default defineComponent({
  props: {
    color: {
      type: String,
      default: "#fff1db",
    },
    pages: {
      type: Object,
      default: {},
    },
    label: {
      type: String,
      default: "暂无文字",
    },
    num: {
      type: Number,
      default: 0,
    },
    types: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      ...props,
    });
    const handlePre = (types: any) => {
      emit("eventPre", types);
    };
    const handleNext = (types: any) => {
      emit("eventNext", types);
    };
    const update = (val: number) => {
      state.num = val;
    };
    return {
      handlePre,
      handleNext,
      update,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.draggable_list {
  box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
.draggabel_header {
  padding: 20px 10px;
  display: flex;
  align-items: center;
  background-color: #fff1db;
  background-color: v-bind(color);
}
.draggabel_icon {
  width: 20px;
  color: #808a97;
}
.label {
  font-size: 16px;
  font-weight: 800;
  color: #333333;
  line-height: 28px;
}
.num {
  margin-left: 10px;
  font-size: 15px;
  font-weight: 700;
  color: #333333;
  line-height: 28px;
}
.text_con {
  flex: 1;
}
.draggabel_manipulate {
  display: flex;
  align-items: center;
}
.draggabel_left_btn,
.draggabel_right_btn {
  width: 22px;
  height: 22px;
  padding: 0;
  line-height: 22px;
  min-height: 22px;
  margin: 0 5px;
}
.draggabel_body {
  padding: 6px;
}
</style>
