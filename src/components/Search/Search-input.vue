<template>
  <div class="searchInput">
    <el-input :modelValue="modelValue"
              @keyup.enter="search"
              placeholder="标题搜索"
              size='small'
              @input="onChange" />
    <el-button type="primary"
               class="search-btn"
               size='small'
               @click="search">搜索</el-button>
    <em class="el-icon-search search-icon" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, toRefs } from "vue";

  export default defineComponent({
    props: {
      modelValue: {
        type: String,
        default: "",
      },
    },
    emits: ["search", "update:modelValue"],
    setup (porp, { emit }) {
      const state = reactive({});
      const onChange = (value: string) => {
        emit("update:modelValue", value);
        console.log(value);
      };
      const search = () => {
        emit("search");
      };
      return {
        onChange,
        search,
        ...toRefs(state),
      };
    },
  });
</script>
<style scoped lang="scss">
  .searchInput {
    position: relative;
    width: 40%;
    display: flex;
    align-items: center;
    :deep(.el-input__inner) {
      padding-left: 36px;
    }
    .search-icon {
      position: absolute;
      left: 8px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      color: rgb(32, 160, 255);
    }
    .search-btn {
      position: relative;
      z-index: 11;
      margin-left: -50px;
    }
  }
</style>
