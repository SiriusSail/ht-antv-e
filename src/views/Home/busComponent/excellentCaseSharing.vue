<template>
  <div class="excellentCaseSharing">
    <h3><img class="iconimg"
           :src="iconimg"
           alt="" /> 优秀案例分析</h3>
    <div class="e-con">
      <div class="e-con"
           v-if='JSON.stringify(objItem) != "{}"'>
        <img class="e-img"
             :src="objItem.thumbnail"
             alt="" />
        <div class="text-con">
          <p>名称：{{objItem.name}}</p>
          <p>描述：{{objItem.description?objItem.description:'暂无描述'}}</p>
        </div>
      </div>
      <div v-else>暂无优秀案例</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineComponent, ref, reactive, toRefs } from "vue";
  import { getDailyGoodCase } from "../api/index";
  import img from "@/assets/images/11835.png";
  import iconimg from "@/assets/images/u240.png";
  const objItem = ref({})
  const getDailyCase = () => {
    getDailyGoodCase().then((res: any) => {
      if (res.result) {
        objItem.value = res.result
      }
    });
  };
  getDailyCase();
</script>
<style scoped lang="scss">
  .excellentCaseSharing {
    font-size: 12px;
    padding: 20px;
  }
  .e-con {
    display: flex;
  }
  .e-img {
    width: 60%;
    object-fit: contain;
    //   height: auto;
    margin-right: 10px;
  }
  .text-con {
    width: 40%;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
    margin-top: 20px;
    height: 100%;
    padding: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    white-space: pre-line;
  }
  .iconimg {
    width: 40px;
    height: 26x;
    margin-right: 8px;
  }
  h3 {
    display: flex;
    align-items: center;
    padding-bottom: 10px;
  }
</style>
