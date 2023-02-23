<template>
  <Mytable class="DataTable" v-bind="$attrs"> </Mytable>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from "vue";
import Mytable from "@/components/table/index.vue"; //表格组件
export default defineComponent({
  components: { Mytable },
  setup() {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style scoped lang="scss"></style>
