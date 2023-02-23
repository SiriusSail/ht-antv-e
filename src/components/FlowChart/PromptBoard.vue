<template>
  <div class="PromptBoard">
    <div class="flex">
      <div class="contribution progressbar"></div>
      <div class="label">贡献度</div>
    </div>
    <div class="flex">
      <div class="relation progressbar"></div>
      <div class="label">关联度</div>
    </div>
    <div class="flex">
      <div class="health progressbar">
        <span>差</span>
        <span>中</span>
        <span>良</span>
        <span>优</span>
      </div>
      <div class="label">健康度</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";

export default defineComponent({
  setup() {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.PromptBoard {
  position: absolute;
  left: 40px;
  top: 30px;
  width: 220px;
  height: 90px;
  z-index: 10;
  .flex {
    display: flex;
    align-items: center;
  }
  .label {
    color: #666666;
    font-size: 12px;
    padding-left: 10px;
  }
  .contribution {
    width: 52px;
    height: 3px;
    background: linear-gradient(243deg, #5b8ff9 0%, #d6dbe3 100%);
    border-radius: 2px;
  }
  .relation {
    width: 52px;
    height: 3px;
    background: linear-gradient(63deg, #6adfaf 0%, #aaf3d5 100%);
    border-radius: 2px;
  }
  .health {
    width: 121px;
    height: 3px;
    background: linear-gradient(
      90deg,
      #fb926c 0%,
      #ffc5a2 35%,
      #d9d3b9 65%,
      #96f4cd 100%
    );
    border-radius: 2px;
    span {
      padding-left: 4px;
      font-size: 12px;
      color: #aaaaaa;

      &:not(:first-child) {
        padding-left: 22px;
      }
    }
  }
}
</style>
