<template>
  <div class="dispatch-wrap">
    <component :is="compNameRef" :select-node="selectNode"></component>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  onMounted,
  PropType,
  watch,
} from "vue";
import * as Element from "element-plus";
import { Node, Graph, Cell } from '@antv/x6';
import http, { PageItem, DraftsProp, DraftsItem } from "./api";
import ItemContent from "./itemContent.vue";
import ItemEcharts from "./itemEcharts.vue";

type DraftDataProp = {
  info:DraftsProp
}

export default defineComponent({
  components: {
    ItemContent,
    ItemEcharts
  },
  props: {
    selectNode: {
      type: Object as PropType<Cell>,
      default: () => {},
    },
  },
  emits: ["on-close", "on-change"],
  setup(props, context) {
    const compNameRef = ref<string>('ItemEcharts')
    const draftData = reactive<DraftDataProp>({
      info: {
        current: 1,
        hitCount: false,
        optimizeCountSql: true,
        records: [],
        orders: [],
        pages: 2,
        searchCount: true,
        size: 10,
        total: 15,
      }
    });

    watch(
      () => props.selectNode,
      (now) => {
        // console.log("now", now);
        if(!now) return;
        if(now.shape === 'echart-shape') {
          compNameRef.value = 'ItemEcharts'
        }else{
          compNameRef.value = 'ItemContent'
        }
      }
    );

    onMounted(() => {
      // getDraftsList();
    });
    return {
      ...toRefs(draftData),
      compNameRef,
    };
  },
});
</script>
<style lang="scss" scoped>
.echarts-shape{
  padding: 3px;
}
</style>
