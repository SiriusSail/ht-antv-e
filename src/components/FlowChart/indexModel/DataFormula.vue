<template>
  <div class="DataFormula">{{ value }}</div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";

export default defineComponent({
  props: {
    value: {
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
.DataFormula {
  width: 100%;
  height: 100%;
  //   border: 1px solid #ccc;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.14);
  border-radius: 4px;
  background-color: #fff;
}
</style>
