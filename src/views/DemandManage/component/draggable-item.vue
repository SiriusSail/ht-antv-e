<template>
  <div
    class="draggable-item"
    :cid="item.rowId"
    @click="handleItem()"
    :class="{
      success: timeState == 1,
      warning: timeState == 2,
      error: timeState == 3,
    }"
  >
    <div class="title">
      【{{ item.parentId ? "任务" : "需求" }}】{{ item.demandName }}
    </div>
    <div class="d-con">
      <div class="c-info">
        <p v-if="item.demandField">领域:{{ item.demandField }}</p>

        <p v-if="item.progressBar">进度: {{ item.progressBar }}</p>
        <p
          v-if="item.deadline"
          :class="{
            success: timeState == 1,
            warning: timeState == 2,
            error: timeState == 3,
          }"
        >
          <em class="el-icon-time icon-time"></em> {{ item.deadline }}
        </p>
      </div>
      <div class="user-info">
        <el-avatar :size="32" :src="avatar"></el-avatar>
        <p class="name">{{ item.demandDeveloper }}</p>
      </div>
    </div>
    <div class="footer">创建时间: {{ format(item.gmtCreate) }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, computed } from "vue";
import Icon3 from "@/assets/images/icon_3.png";
import avatar from "@/assets/images/avather-404.png";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
dayjs.extend(isSameOrAfter);

export default defineComponent({
  props: {
    index: {
      type: Number,
      default: "",
      required: true,
    },
    item: {
      type: Object,
      default: {},
    },
    color: {
      type: String,
      default: "#fff1db",
    },
    types: {
      type: Number,
      default: "",
    },
  },
  setup(props, { emit }) {
    const handleItem = () => {
      emit("eventItem", props);
    };
    //获取当天日期

    const timeState = computed(() => {
      if (!props.item.deadline) {
        return 1; //正常
      }
      const endTime = dayjs(props.item.deadline); // 超期时间
      const newTime = dayjs(); //当前时间
      const waringTime = endTime.subtract(5, "day"); //警告时间
      // 当前时间大于警告时间 并且 当前时间小于超期时间
      if (props.item.demandState == "5") {
        return 1; //正常
      } else if (newTime.isAfter(waringTime) && newTime.isBefore(endTime)) {
        return 2; //警告
      } else if (newTime.isSameOrAfter(endTime)) {
        return 3; //超期
      } else {
        return 1; //正常
      }
    });
    // console.log(dayjs().isBefore(dayjs("2011-01-01")));
    const format = (str: string) => {
      return dayjs(str).format("YYYY-MM-DD");
    };

    return { timeState, avatar, format, Icon3, handleItem };
  },
});
</script>
<style scoped lang="scss">
$success-color: #67c23a;
$warning-color: #e6a23c;
$error-color: #d9001b;
.draggable-item {
  position: relative;
  padding: 10px;
  border: 1px solid #e0eaf2;
  border-radius: 5px;
  overflow: hidden;
  background-color: #fff;
  // min-width: 188px;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.1);
  .icon-time {
    margin-top: 10px;
  }

  &:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 4px;
    background-color: v-bind(color);
  }
  &.success {
    &::before {
      background-color: $success-color;
    }
  }

  &.warning {
    &::before {
      background-color: $warning-color;
    }
  }
  &.error {
    &::before {
      background-color: $error-color;
    }
  }
  .d-con {
    display: flex;
    word-wrap: break-word;
    word-break: break-all;
    .image {
      width: 23px;
      height: 26px;
    }
  }
  .c-info {
    padding-left: 10px;
    flex: 1;
    font-size: 12px;
    overflow: hidden;
  }
  .title {
    font-size: 12px;
    color: #333333;
    line-height: 25px;
  }
  .i-time {
    padding-top: 10px;
  }
  .desc {
    margin-top: 10px;
    font-size: 13px;
    line-height: 17px;
  }
  .footer {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666666;
    font-size: 12px;
    color: #cccccc;
  }
  .user-info {
    width: 40px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .name {
      width: 40px;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      white-space: nowrap; //溢出不换行
      text-align: center;
      font-size: 12px;
    }
  }
  .user-name {
    padding-right: 5px;
  }
  .btn {
    padding: 7px 10px;
  }

  .success {
    color: $success-color;
  }

  .warning {
    color: $warning-color;
  }
  .error {
    color: $error-color;
  }
}
</style>
