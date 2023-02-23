<template>
  <div class="dashboard-card">
    <div class="card-head">
      <div class="left-con">{{ label }}</div>
      <div class="right-con">
        <em v-if="icon" :class="icon" />
      </div>
    </div>
    <div
      class="card-body"
      :style="{ height: height }"
      :class="{ 'card-body_bottom_border': bodyBorder }"
    >
      <slot name="body" />
    </div>
    <div class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    label: {
      type: String,
      require: true,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    bodyBorder: {
      type: Boolean,
      default: false,
    },
    height: {
      require: true,
      type: String,
      default: "",
    },
  },
  setup() {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.dashboard-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  .card-head {
    color: #666;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-body {
    // padding-bottom: 10px;
    min-height: 140px;
  }
  .card-body_bottom_border {
    border-bottom: 1px solid #ccc;
  }
  .card-footer {
    padding-top: 10px;
  }

  .left-con {
    font-size: 18px;
    font-weight: 600;
    color: #666;
  }
}
</style>
