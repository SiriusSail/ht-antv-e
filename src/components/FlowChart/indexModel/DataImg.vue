<template>
  <div class="DataImg">
    <img :src="img" alt="" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    img: {
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
.DataImg {
  width: 100%;
  height: 100%;
  //   border: 1px solid #ccc;
  // box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  // background-color: #fff;
  display: flex;
  align-content: center;
  justify-content: center;
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>
