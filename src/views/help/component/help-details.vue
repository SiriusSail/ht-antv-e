<template>
  <div class="help-details">
    <div class="text"><span class="label">[求助类型]</span> 指标求助</div>
    <div class="text"><span class="label">[求助领域]</span> 指标求助</div>
    <div class="text">
      <span class="label">[求助内容]</span> 求助求助求助求助
    </div>
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";

export default defineComponent({
  setup() {
    const state = reactive({
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    });
    const handleRemove = (file, fileList) => {
      console.log(file, fileList);
    };
    const handlePreview = (file) => {
      console.log(file);
    };
    return {
      handleRemove,
      handlePreview,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.help-details {
  .text {
    color: #666666;
    font-size: 16px;
    padding-bottom: 20px;
    .label {
      font-weight: 600;
    }
  }
}
</style>
