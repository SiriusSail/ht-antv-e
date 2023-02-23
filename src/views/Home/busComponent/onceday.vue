<template>
  <div class="onceday">
    <h3><img class="img"
           :src="img"
           alt="" /> 每日一贴</h3>
    <div class="text-con">
      {{ content?content:'暂无每日一贴' }}
    </div>
  </div>
</template>
<script lang="ts" setup>
  import img from "@/assets/images/u233.png";
  import { dailyNote } from "@/views/Home/api/index";
  import { defineComponent, ref, reactive, toRefs } from "vue";
  const content = ref("");
  const getDailyNote = () => {
    dailyNote().then((res) => {
      content.value = res.result.content;
    });
  };
  getDailyNote();
</script>
<style scoped lang="scss">
  .onceday {
    font-size: 12px;
    padding: 20px;
  }
  .text-con {
    padding: 12px;
    white-space: pre-line;
  }
  .img {
    width: 32px;
    height: 32px;
    margin-right: 8px;
  }
  h3 {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }
</style>
