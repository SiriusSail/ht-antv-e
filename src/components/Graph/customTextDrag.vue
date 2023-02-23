<template>
  <div class="x6-textarea">
    <div class="textarea-title">{{ item.title }}</div>
    <el-input
      v-model="item.content"
      type="textarea"
      placeholder="请输入节点描述"
    ></el-input>
  </div>
</template>

<script lang="ts">
import { Node } from "@antv/x6";
import {
  onMounted,
  reactive,
  toRefs,
  defineComponent,
  inject,
  computed,
} from "vue";
import * as Element from "element-plus";

const { ElInput } = Element;

export default defineComponent({
  name: "TextComponen",
  components: {
    ElInput,
  },
  setup() {
    const dataObj = reactive({
      item: { title: "", content: "" },
    });
    const getNode = inject<() => Node>("getNode")?.() || ({} as Node);
    if (!getNode.attrs.option) {
      dataObj.item = { title: "", content: "" };
    } else {
      dataObj.item = getNode.attrs.option;
    }

    // console.log("Text1", getNode);
    onMounted(() => {
      // debugger
      // const node = computed(() => store.getters['indexCardModule/getCacheNode'])
    });

    return {
      ...toRefs(dataObj),
    };
  },
});
</script>
