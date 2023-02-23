<template>
  <div class="ranking_list">
    <p class="ranking-title">
      {{ typeList[type] }}
    </p>
    <div
      v-for="(item, index) in ranking_list"
      :key="index"
      class="item"
      :class="{ isCurrentUser: item.isCurrentUser, me: index == 5 }"
    >
      <img class="img" v-if="index < 3" :src="ranking_img[index]" alt="" />

      <div v-else-if="item.rank" class="img">{{ item.rank }}</div>
      <div v-else class="img">{{ index + 1 }}</div>
      <el-tooltip
        v-if="item.createUsername"
        effect="dark"
        :content="item.createUsername"
        placement="top-start"
        :disabled="tooltipDisabled"
      >
        <div class="label" @mouseenter="spanMouseenter($event)">
          {{ item.createUsername }}
        </div>
      </el-tooltip>
      <!-- 0=综合统计，1=开发任务统计，2=推荐统计，3=知识统计 -->
      <div v-if="type === 0" class="num">{{ item.summaryPoints }}</div>
      <div v-if="type === 1" class="num">{{ item.devPoints }}</div>
      <div v-if="type === 2" class="num">{{ item.recommendationPoints }}</div>
      <div v-if="type === 3" class="num">{{ item.knowledgePoints }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const typeList = {
  0: "综合统计",
  1: "开发任务统计",
  2: "推荐统计",
  3: "知识统计",
};
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  defineProps,
  PropType,
} from "vue";
import numberone from "@/assets/images/numberone.svg";
import numbertwo from "@/assets/images/numbertwo.svg";
import numberthree from "@/assets/images/numberthree.svg";
import { TopType, TopListParams } from "@/views/Empowerment/api/types/index";
import { topList } from "@/views/Empowerment/api/index";

const ranking_img = [numberone, numbertwo, numberthree];
const props = defineProps({
  type: {
    type: Number as PropType<TopListParams>,
    require: true,
  },
});
const tooltipDisabled = ref(true);
const ranking_list = ref<TopType[]>([]);

const GetData = async () => {
  console.log(props.type);
  const res = await topList(props.type);
  if (res.code == 200) {
    ranking_list.value = res.result;
  }
};
// 超出显示 没超出不显示
const spanMouseenter = (ev: any) => {
  if (ev.target.clientWidth < ev.target.scrollWidth) {
    tooltipDisabled.value = false;
  } else {
    tooltipDisabled.value = true;
  }
};
GetData();
</script>
<style scoped lang="scss">
.ranking_list {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  // height: 210px;
  min-height: 250px;
  .ranking-title {
    font-weight: 600;
    padding-bottom: 8px;
    text-align: center;
  }
  .item {
    height: 35px;
    display: flex;
    align-items: center;
    flex-direction: row;
    border-bottom: 1px solid #e5e5e5;
    font-size: 14px;
    .img {
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
    }
    &:last-child {
      border-bottom: none;
    }
    .label {
      padding-left: 10px;
      font-size: 14px;
      height: 22px;
      line-height: 22px;
      width: 60%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .num {
      height: 22px;
      line-height: 22px;
      padding-left: 10px;
      font-size: 14px;
    }
    .icon-rise {
      font-size: 24px;
      color: #1ec435;
    }
    .icon-decline {
      font-size: 24px;
      color: #f53535;
    }
    .el-icon-minus {
      font-size: 24px;
      color: #f1a644;
    }
  }
  &:not(:first-child) {
    margin-left: 40px;
  }
  .isCurrentUser {
    font-weight: 600;
    color: #f53535;
  }
  // .me{

  // }
}
</style>
