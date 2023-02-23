<template>
  <div class="hot-list">
    <div class="head">
      <em class="el-home" /> <span class="title"> 智积推荐</span>
    </div>
    <div class="hot-con" v-if="list.length > 0">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="item"
        @click="itemClick(item)"
      >
        <img v-if="index < 3" class="icon"  :src="rankingImg[index]" alt="" />
        <span v-else class="icon"> {{ index + 1 }}</span>
        <span class="label">
          {{ item.userCode }}
        </span>

      </div>
    </div>
    <div class="hot-con" v-else>
      <p class="tip-text">请选择求助类型和求助领域获取智积推荐</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs, PropType } from "vue";
import numberone from "@/assets/images/numberone.svg";
import numbertwo from "@/assets/images/numbertwo.svg";
import numberthree from "@/assets/images/numberthree.svg";
import { Recommendation } from "../api/index";

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Recommendation[]>,
      require: true,
    },
  },
  setup(porp, { emit }) {
    const state = reactive({
      rankingImg: [numberone, numbertwo, numberthree],
    });
    const itemClick = (data: Recommendation) => {
      emit("item-click", data);
    };
    return {
      itemClick,
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss">
.hot-list {
  border: 1px solid #c0ccda;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  .tip-text {
    color: #666;
    font-size: 12px;
  }
  .head {
    display: flex;
    align-items: center;
    height: 50px;
    background: #ecf4ff;
    padding: 0 30px;
    .title {
      padding-left: 3px;
    }
  }
  .hot-con {
    padding: 18px;
    padding-bottom: 10px;
  }
  .user-avatar {
    width: 18px;
    height: 18px;
  }
  .item {
    font-size: 12px;
    color: #666666;
    height: 50px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid #e5e5e5;
    cursor: pointer;
    .el-avatar {
      padding-left: 18px;
      margin-left: 10px;
    }
    .icon {
      width: 22px;
      height: 22px;
      text-align: center;
    }
    &:last-child {
      border-bottom: none;
    }
    .label {
      padding-left: 10px;
      // width: 30%;
    }
    .num {
      padding-left: 10px;
    }
  }
}
</style>
